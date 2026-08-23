'use server'

import { createSession, destroySession, getSession } from '@/lib/session'
import { supabase } from '@/lib/supabase'

export async function loginAction(nis: string) {
  // Verifikasi NIS ada di database
  const { data, error } = await supabase
    .from('voters')
    .select('*')
    .eq('nis', nis.trim())
    .single()

  if (error || !data) {
    return { success: false, error: 'NIS_NOT_FOUND' }
  }

  if (data.has_voted) {
    return { success: false, error: 'ALREADY_VOTED' }
  }

  // Buat JWT Cookie aman
  await createSession(data.nis)
  
  return { success: true, nis: data.nis }
}

export async function getVoterSession() {
  return await getSession()
}

export async function submitVoteAction(candidateId: string) {
  const session = await getSession()
  
  if (!session || !session.nis) {
    return { success: false, error: 'UNAUTHORIZED' }
  }

  // Note: RPC will still use the anon key in this server context.
  // Tapi setidaknya eksekusi di-filter dan diabstraksi sehingga client tidak bisa mengubah `voter_nis` seenaknya via DevTools.
  // Untuk keamanan absolut (DB-level), Anda perlu menggunakan Supabase Auth sungguhan atau service_role key.
  const { error } = await supabase.rpc('vote_for_candidate', {
    voter_nis: session.nis,
    candidate_id: candidateId
  })

  if (error) {
    if (error.message.includes('Already voted')) {
      return { success: false, error: 'ALREADY_VOTED' }
    }
    return { success: false, error: 'UNKNOWN_ERROR', details: error.message }
  }

  return { success: true }
}

export async function logoutAction() {
  await destroySession()
}
