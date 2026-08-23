'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Vote() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string, name: string} | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isVoting, setIsVoting] = useState(false)
  const router = useRouter()
  const voterNis = typeof window !== 'undefined' ? localStorage.getItem('voter_nis') : null

  useEffect(() => {
    if (!voterNis) {
      router.push('/')
      return
    }

    supabase
      .from('candidates')
      .select('*')
      .order('name')
      .then(({data}) => {
        setCandidates(data || [])
        setLoading(false)
      })
  }, [voterNis, router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (errorMsg) setErrorMsg('');
        else if (confirmModal?.isOpen) setConfirmModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errorMsg, confirmModal?.isOpen]);

  const handleVote = (id: string, name: string) => {
    setConfirmModal({ isOpen: true, id, name })
  }

  const executeVote = async () => {
    if (!confirmModal) return;
    setIsVoting(true)
    const { error } = await supabase.rpc('vote_for_candidate', {
      voter_nis: voterNis,
      candidate_id: confirmModal.id
    })
    
    if(!error) {
      localStorage.setItem('device_locked', 'true')
      router.push('/success')
    } else {
      setIsVoting(false)
      setConfirmModal(null)
      setErrorMsg('Otorisasi gagal. Jaringan tidak stabil atau anomali data terdeteksi.')
      if (error.message.includes('Already voted')) {
        setTimeout(() => router.push('/'), 2000)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('voter_nis')
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] flex items-center justify-center">
      <div className="flex items-center gap-4 opacity-0 animate-fade-up">
        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-black/40">Sinkronisasi Ledger...</span>
      </div>
    </div>
  )

  return (
    <>
    <div className="min-h-[100dvh] bg-[var(--color-background)] pb-40 relative">
      
      {/* Background Image & Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/inilogo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-40 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-blue-50 blur-[100px] rounded-full mix-blend-multiply opacity-50"></div>
      </div>

      {/* Fluid Island Nav */}
      <div className="sticky top-6 z-50 px-4 w-full flex justify-center opacity-0 animate-fade-up">
        <div className="bg-white/80 backdrop-blur-2xl border border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-2 py-2 flex items-center justify-between w-full max-w-4xl transition-all">
          <div className="flex items-center gap-3 pl-4">
            <div className="w-1.5 h-1.5 bg-[var(--color-brand)] rounded-full shadow-[0_0_8px_var(--color-brand)]"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-foreground)]">ICT SMKN 20</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-foreground)]/60 font-medium">
              Sesi: <span className="text-[var(--color-foreground)] ml-1">{voterNis}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            >
              <svg className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-500 ease-vanguard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-32 relative z-10">
        <div className="mb-24 max-w-2xl opacity-0 animate-fade-up-1">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-tight text-[var(--color-foreground)] mb-6">
            Kandidat <br/>Ketua ICT.
          </h2>
          <p className="text-[var(--color-foreground)]/60 text-base md:text-lg leading-relaxed font-medium">
            Pilih inovator terbaik untuk memimpin Ekstrakurikuler IT SMKN 20 Jakarta. Suara Anda dijamin kerahasiaannya dan bersifat final.
          </p>
        </div>
        
        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          {candidates.map((c, index) => {
            // Create asymmetrical rhythm: some span 12, some span 6 on large screens
            const spanClass = (candidates.length % 2 !== 0 && index === 0) ? 'lg:col-span-12' : 'lg:col-span-6'
            const fadeDelay = `animate-fade-up-${Math.min((index % 3) + 1, 3)}`
            
            return (
              <div key={c.id} className={`${spanClass} opacity-0 ${fadeDelay} flex`}>
                
                {/* Double-Bezel Architecture */}
                <div className="w-full bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] border border-[var(--color-border)] shadow-xl shadow-blue-900/5 flex flex-col group transition-all duration-700 ease-vanguard hover:shadow-2xl hover:shadow-[var(--color-brand)]/20">
                  <div className="bg-white rounded-[calc(2.5rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col h-full overflow-hidden">
                    
                    {/* Header Image Area */}
                    <div className="relative w-full h-64 sm:h-80 bg-[var(--color-surface)] overflow-hidden">
                      {c.photo_url ? (
                        <img 
                          src={c.photo_url}
                          alt={`Foto Kandidat ${c.name}`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-vanguard group-hover:scale-105" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-widest text-[var(--color-foreground)]/30 font-bold">Aset Tidak Tersedia</span>
                        </div>
                      )}
                      
                      {/* Badge Overlay */}
                      <div className="absolute top-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand)] shadow-sm">
                          Kandidat 0{index + 1}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-8 sm:p-12 flex flex-col flex-grow">
                      <h3 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] mb-6">{c.name}</h3>
                      
                      <div className="flex-grow mb-12">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-brand)] mb-4">Visi & Misi Terverifikasi</p>
                        <p className="text-[var(--color-foreground)]/80 text-sm leading-[1.8] font-medium whitespace-pre-wrap">
                          {c.vision_mission || '—'}
                        </p>
                      </div>
                      
                      {/* Nested CTA */}
                      <button 
                        onClick={() => handleVote(c.id, c.name)} 
                        className="group/btn w-full bg-[var(--color-brand)] text-white py-2 pl-6 pr-2 rounded-full hover:bg-[var(--color-brand-hover)] transition-all duration-500 ease-vanguard active:scale-[0.98] flex justify-between items-center shadow-lg shadow-[var(--color-brand)]/20"
                      >
                        <span className="font-medium text-sm tracking-wide">
                          Pilih Kandidat
                        </span>
                        
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-vanguard group-hover/btn:scale-105 group-hover/btn:bg-white/30">
                          <svg className="w-4 h-4 text-white transform transition-transform duration-500 ease-vanguard group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
          
          {candidates.length === 0 && (
            <div className="lg:col-span-12">
              <div className="w-full bg-transparent border border-[var(--color-border)] rounded-[2rem] p-16 text-center">
                <span className="text-xs uppercase tracking-widest text-[var(--color-foreground)]/40 font-medium">Data Kandidat Belum Siap</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Error Modal */}
    {errorMsg && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity" onClick={() => setErrorMsg('')}></div>
        <div className="relative bg-white/60 backdrop-blur-2xl p-1.5 rounded-[2rem] border border-[var(--color-border)] shadow-2xl w-full max-w-sm z-10 opacity-0 animate-fade-up">
          <div className="bg-white rounded-[calc(2rem-0.375rem)] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] mb-3">Gagal Menyimpan Suara</h3>
            <p className="text-[var(--color-foreground)]/60 text-sm leading-relaxed mb-8">{errorMsg}</p>
            <button onClick={() => setErrorMsg('')} className="w-full bg-[var(--color-brand)] text-white font-medium text-sm py-4 rounded-xl hover:bg-[var(--color-brand-hover)] transition-all active:scale-[0.98]">
              Tutup
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Confirm Vote Modal (Editorial Style) */}
    {confirmModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity" onClick={() => !isVoting && setConfirmModal(null)}></div>
        
        <div className="relative bg-white/60 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl w-full max-w-md z-10 opacity-0 animate-fade-up">
          <div className="bg-white rounded-[calc(2.5rem-0.5rem)] p-8 sm:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-6 border border-[var(--color-border)]">
                <svg className="w-5 h-5 text-[var(--color-brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] mb-4">Konfirmasi Pilihan</h3>
              <p className="text-[var(--color-foreground)]/60 text-sm leading-relaxed">
                Anda akan memberikan suara untuk <span className="font-bold text-[var(--color-foreground)]">{confirmModal.name}</span>. 
                Sesuai aturan panitia, pilihan tidak dapat diubah setelah dikonfirmasi.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                autoFocus
                disabled={isVoting}
                onClick={executeVote} 
                className="group w-full bg-[var(--color-brand)] text-white py-2 pl-6 pr-2 rounded-full hover:bg-[var(--color-brand-hover)] transition-all duration-500 ease-vanguard active:scale-[0.98] disabled:opacity-50 flex justify-between items-center shadow-md shadow-[var(--color-brand)]/20"
              >
                <span className="font-medium text-sm tracking-wide">
                  {isVoting ? 'Mengenkripsi Suara...' : 'Ya, Pilih Kandidat'}
                </span>
                
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-vanguard group-hover:scale-105 group-hover:bg-white/30">
                  {isVoting ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white transform transition-transform duration-500 ease-vanguard group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
              
              <button 
                disabled={isVoting}
                onClick={() => setConfirmModal(null)} 
                className="w-full bg-transparent text-[var(--color-foreground)] py-4 rounded-full hover:bg-[var(--color-surface)] transition-colors active:scale-[0.98] font-medium text-sm disabled:opacity-50 border border-transparent hover:border-[var(--color-border)]"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </>
  )
}
