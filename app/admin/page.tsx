'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminReport() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [totalVoters, setTotalVoters] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Ambil kandidat
      const { data: cData } = await supabase.from('candidates').select('*').order('vote_count', { ascending: false })
      if (cData) setCandidates(cData)

      // Ambil total suara sah
      const { count: vCount } = await supabase.from('voters').select('*', { count: 'exact', head: true }).eq('has_voted', true)
      // Ambil total pemilih terdaftar
      const { count: allVoters } = await supabase.from('voters').select('*', { count: 'exact', head: true })
      
      setTotalVotes(vCount || 0)
      setTotalVoters(allVoters || 0)
      setLoading(false)
    }

    fetchData()
  }, [])

  const winner = candidates.length > 0 ? candidates[0] : null
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) return <div className="p-10">Memuat data...</div>

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)] tracking-tight">Laporan Pemilihan</h1>
        <button 
          onClick={() => window.print()}
          className="bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Cetak Berita Acara
        </button>
      </div>

      {/* Area Print Berita Acara */}
      <div className="border border-[var(--color-border)] p-8 md:p-12 rounded-2xl print:border-none print:p-0">
        <div className="text-center mb-10 pb-6 border-b-2 border-slate-800">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-1">Berita Acara</h2>
          <h3 className="text-xl font-semibold">Pemilihan Ketua Ekstrakurikuler ICT</h3>
          <p className="text-slate-600 mt-2">Tanggal: {today}</p>
        </div>

        <div className="mb-8 leading-relaxed text-slate-800">
          <p className="mb-4">
            Pada hari ini, panitia pemilihan telah melaksanakan pemungutan suara secara elektronik (e-voting) dengan hasil rekapitulasi sebagai berikut:
          </p>
          <table className="w-full mb-6 border-collapse border border-slate-300">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-3 font-semibold bg-slate-50 w-1/2">Total Daftar Pemilih Tetap</td>
                <td className="border border-slate-300 p-3 text-center font-bold text-lg">{totalVoters} Orang</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-3 font-semibold bg-slate-50">Total Suara Masuk (Sah)</td>
                <td className="border border-slate-300 p-3 text-center font-bold text-lg">{totalVotes} Orang</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-3 font-semibold bg-slate-50">Tingkat Partisipasi</td>
                <td className="border border-slate-300 p-3 text-center font-bold text-lg">
                  {totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0}%
                </td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-lg mb-4 mt-8">Rincian Perolehan Suara:</h4>
          <table className="w-full border-collapse border border-slate-300 mb-8">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-3 text-left">Nama Kandidat</th>
                <th className="border border-slate-300 p-3 text-center w-32">Total Suara</th>
                <th className="border border-slate-300 p-3 text-center w-32">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id}>
                  <td className="border border-slate-300 p-3 font-medium">{c.name}</td>
                  <td className="border border-slate-300 p-3 text-center font-bold">{c.vote_count}</td>
                  <td className="border border-slate-300 p-3 text-center">
                    {totalVotes > 0 ? ((c.vote_count / totalVotes) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {winner && totalVotes > 0 && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10 text-center">
              <p className="text-lg">Berdasarkan hasil pemungutan suara terbanyak, maka:</p>
              <h2 className="text-2xl font-bold text-[var(--color-brand)] my-2 uppercase">{winner.name}</h2>
              <p className="text-lg">Ditetapkan sebagai Ketua Ekstrakurikuler ICT terpilih.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-20 pt-10 px-10">
          <div className="text-center">
            <p className="mb-20">Pembina Ekstrakurikuler</p>
            <p className="font-bold underline">_________________________</p>
            <p className="text-sm mt-1">NIP. </p>
          </div>
          <div className="text-center">
            <p className="mb-20">Ketua Panitia Pemilihan</p>
            <p className="font-bold underline">_________________________</p>
            <p className="text-sm mt-1">NIS. </p>
          </div>
        </div>
      </div>
    </div>
  )
}

