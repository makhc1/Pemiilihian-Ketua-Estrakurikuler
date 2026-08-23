'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Vote() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string, name: string} | null>(null)
  const [detailModal, setDetailModal] = useState<any | null>(null)
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
        else if (detailModal) setDetailModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errorMsg, confirmModal?.isOpen, detailModal]);

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
        
        {/* Compact Grid Architecture */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-10">
          {candidates.map((c, index) => {
            const delays = ['animate-fade-up-1', 'animate-fade-up-2', 'animate-fade-up-3']
            const fadeDelay = delays[index % 3]
            
            return (
              <button 
                key={c.id} 
                onClick={() => setDetailModal(c)}
                className={`group flex flex-col items-center bg-white/60 backdrop-blur-md p-3 sm:p-5 rounded-3xl border border-[var(--color-border)] shadow-lg shadow-blue-900/5 transition-all duration-500 ease-vanguard hover:shadow-xl hover:shadow-[var(--color-brand)]/20 hover:-translate-y-1 opacity-0 ${fadeDelay}`}
              >
                <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
                  {c.photo_url ? (
                    <img 
                      src={c.photo_url}
                      alt={`Foto Kandidat ${c.name}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-vanguard group-hover:scale-105" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[var(--color-foreground)]/30 font-bold">No Photo</span>
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand)] shadow-sm">
                    0{index + 1}
                  </div>
                </div>
                
                <h3 className="font-bold text-sm sm:text-lg tracking-tight text-[var(--color-foreground)] text-center line-clamp-2">{c.name}</h3>
                <p className="mt-3 flex items-center justify-center gap-1 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold text-[var(--color-brand)]/80 group-hover:text-[var(--color-brand)] transition-colors">
                  <span>Lihat Detail</span>
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </p>
              </button>
            )
          })}
          
          {candidates.length === 0 && (
            <div className="col-span-2 sm:col-span-3">
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
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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

    {/* Detail Modal (Glassmorphism) */}
    {detailModal && (
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity" onClick={() => setDetailModal(null)}></div>
        
        <div className="relative bg-white/60 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10 opacity-0 animate-fade-up overflow-hidden">
          <div className="bg-white rounded-[calc(2.5rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col h-full overflow-hidden">
            
            {/* Header Image */}
            <div className="relative w-full h-48 sm:h-64 bg-[var(--color-surface)] shrink-0">
              {detailModal.photo_url ? (
                <img 
                  src={detailModal.photo_url}
                  alt={`Foto Kandidat ${detailModal.name}`}
                  className="absolute inset-0 w-full h-full object-cover object-center" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-foreground)]/30 font-bold">Aset Tidak Tersedia</span>
                </div>
              )}
              
              <button 
                onClick={() => setDetailModal(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content (Scrollable with Affordance) */}
            <div className="relative flex-grow min-h-0 overflow-hidden flex flex-col">
              <div className="p-6 sm:p-10 overflow-y-auto flex-grow">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mb-6">{detailModal.name}</h3>
                
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-brand)] mb-3">Visi & Misi Terverifikasi</p>
                  <p className="text-[var(--color-foreground)]/80 text-sm leading-[1.8] font-medium whitespace-pre-wrap">
                    {detailModal.vision_mission || '—'}
                  </p>
                </div>
              </div>
              {/* Fade out scroll indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
            
            {/* Fixed Footer */}
            <div className="p-4 sm:p-6 border-t border-[var(--color-border)] bg-gray-50/50 shrink-0">
              <button 
                onClick={() => {
                  setDetailModal(null);
                  handleVote(detailModal.id, detailModal.name);
                }} 
                className="group w-full bg-[var(--color-brand)] text-white py-2 pl-6 pr-2 rounded-full hover:bg-[var(--color-brand-hover)] transition-all duration-500 ease-vanguard active:scale-[0.98] flex justify-between items-center shadow-lg shadow-[var(--color-brand)]/20"
              >
                <span className="font-medium text-sm tracking-wide">
                  Pilih Kandidat Ini
                </span>
                
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-vanguard group-hover:scale-105 group-hover:bg-white/30">
                  <svg className="w-4 h-4 text-white transform transition-transform duration-500 ease-vanguard group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
            
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
