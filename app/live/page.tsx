'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function LiveDashboard() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [totalVoters, setTotalVoters] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const { data: cData, error: cError } = await supabase.from('candidates').select('*').order('name')
      if (cError) throw cError
      if (cData) setCandidates(cData)

      const { count: vCount, error: vError } = await supabase.from('voters').select('*', { count: 'exact', head: true }).eq('has_voted', true)
      if (vError) throw vError
      
      const { count: allVoters, error: allVError } = await supabase.from('voters').select('*', { count: 'exact', head: true })
      if (allVError) throw allVError
      
      setTotalVotes(vCount || 0)
      setTotalVoters(allVoters || 0)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    const subCandidates = supabase.channel('realtime_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voters' }, () => fetchData())
      .subscribe()

    return () => { 
      supabase.removeChannel(subCandidates)
    }
  }, [])

  const maxVotes = Math.max(...candidates.map(c => c.vote_count), 1)
  const participationRate = totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse" aria-busy="true" aria-label="Memuat data live count">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--color-brand)] border-t-transparent animate-spin"></div>
          <span className="text-sm uppercase tracking-widest font-medium text-[var(--color-foreground)]/60">Sinkronisasi Ledger...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div role="alert" className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">Gagal Menghubungkan ke Server</h2>
          <p className="text-sm text-[var(--color-foreground)]/60 mb-6">{error}</p>
          <button onClick={fetchData} className="bg-[var(--color-brand)] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors">
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[var(--color-background)] flex flex-col overflow-hidden relative">
      
      {/* Background Image & Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/inilogo.jpg"
          alt="Background SMKN 20"
          fill
          priority
          className="object-cover object-center opacity-40 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white"></div>
      </div>

      {/* Header */}
      <header className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full font-bold text-[10px] tracking-widest flex items-center gap-2 uppercase shadow-sm">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              LIVE
            </div>
            <h2 className="text-[var(--color-foreground)]/60 font-medium tracking-widest uppercase text-[10px]">Pemilihan Ketua ICT SMKN 20</h2>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-[var(--color-foreground)]">
            Real-Time Count.
          </h1>
        </div>
        
        <div className="w-full md:w-auto bg-white/60 backdrop-blur-md border border-[var(--color-border)] p-4 rounded-2xl shadow-sm flex items-center gap-6">
          <div>
            <p className="text-[var(--color-foreground)]/50 font-bold uppercase tracking-widest text-[10px] mb-1">Total Suara Masuk</p>
            <div className="text-2xl font-bold font-mono tracking-tight text-[var(--color-foreground)]">
              {totalVotes} <span className="text-[var(--color-foreground)]/30 text-lg">/ {totalVoters}</span>
            </div>
          </div>
          <div className="h-12 w-px bg-[var(--color-border)]"></div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[var(--color-foreground)]/50 font-bold uppercase tracking-widest text-[10px]">Partisipasi</span>
              <span className="text-[var(--color-brand)] font-bold text-xs">{participationRate}%</span>
            </div>
            <div className="w-32 h-1.5 bg-[var(--color-surface)] rounded-full overflow-hidden relative border border-[var(--color-border)]">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-[var(--color-brand)] transition-all duration-1000 ease-vanguard" 
                style={{width: `${participationRate}%`}}
                role="progressbar"
                aria-valuenow={participationRate}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chart Area */}
      <main className="flex-1 p-4 md:p-8 pb-0 flex flex-col justify-end relative z-10 overflow-hidden">
        {candidates.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8 bg-white/40 backdrop-blur-md rounded-2xl border border-[var(--color-border)]">
              <p className="text-[var(--color-foreground)]/50 font-medium">Belum ada data kandidat yang terdaftar.</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto flex items-end justify-center gap-4 md:gap-8 lg:gap-16 h-full">
            {candidates.map((c, idx) => {
              const percentage = totalVotes > 0 ? ((c.vote_count / totalVotes) * 100).toFixed(1) : '0.0'
              const height = Math.max((c.vote_count / maxVotes) * 100, 8) // Max 100% of flex container, min 8% for visibility

              return (
                <div key={c.id} className="flex flex-col items-center justify-end w-full max-w-[280px] h-full relative group">
                  
                  {/* Floating Vote Count */}
                  <div className="mb-4 md:mb-6 text-center transform transition-all duration-1000 shrink-0">
                    <span className="text-4xl md:text-6xl font-bold block tracking-tighter text-[var(--color-foreground)]">
                      {c.vote_count}
                    </span>
                    <span className="text-xs md:text-sm text-[var(--color-brand)] font-bold tracking-[0.2em] uppercase mt-1 block">Suara</span>
                  </div>
                  
                  {/* Glassmorphism Bar */}
                  <div className="flex-1 w-full flex items-end justify-center relative px-2 md:px-0">
                    <div 
                      className="w-full max-w-[200px] rounded-t-3xl transition-all duration-[1500ms] ease-vanguard relative overflow-hidden bg-white/40 backdrop-blur-md border border-[var(--color-border)] border-b-0 shadow-lg shadow-[var(--color-brand)]/5 group-hover:bg-white/60 group-hover:shadow-[var(--color-brand)]/10"
                      style={{height: `${height}%`}}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-white/50"></div>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[var(--color-brand)]/20 transition-all duration-1000 ease-vanguard"
                        style={{ height: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Candidate Info Card */}
                  <div className="mt-4 md:mt-8 text-center bg-white p-4 md:p-6 rounded-[2rem] w-full shadow-xl shadow-blue-900/5 border border-[var(--color-border)] relative overflow-hidden shrink-0 z-10 transition-transform duration-500 hover:-translate-y-2">
                    <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[var(--color-surface)] shadow-md bg-[var(--color-surface)]">
                      {c.photo_url ? (
                        <img 
                          src={c.photo_url}
                          alt={`Kandidat ${c.name}`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover object-center" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--color-foreground)]/30 font-bold uppercase">No Photo</div>
                      )}
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-[var(--color-brand)] text-[10px] font-bold tracking-widest mb-1 uppercase">Kandidat 0{idx + 1}</p>
                      <h3 className="font-bold text-lg md:text-xl text-[var(--color-foreground)] leading-tight mb-3 truncate px-2">{c.name}</h3>
                      <div className="inline-block bg-[var(--color-surface)] px-4 py-1.5 rounded-full border border-[var(--color-border)]">
                        <p className="text-[var(--color-foreground)] font-mono text-sm md:text-base font-bold tracking-tight">{percentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      
    </div>
  )
}
