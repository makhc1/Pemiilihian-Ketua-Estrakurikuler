'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Success() {
  const router = useRouter()
  
  useEffect(() => {
    // Logout otomatis dengan menghapus session lokal
    if (typeof window !== 'undefined') {
      localStorage.removeItem('voter_nis')
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background Image & Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/inilogo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-30 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white"></div>
      </div>

      {/* Double-Bezel Architecture */}
      <div className="relative w-full max-w-lg bg-white/60 backdrop-blur-2xl p-2 rounded-[3rem] border border-[var(--color-border)] shadow-2xl z-10 opacity-0 animate-fade-up">
        
        {/* Inner Core */}
        <div className="bg-white rounded-[calc(3rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-12 sm:p-16 flex flex-col items-center text-center relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-green-50/50 to-transparent pointer-events-none"></div>

          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-10 border border-green-100 shadow-sm">
            <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)] mb-6">Suara<br/>Terekam.</h1>
          
          <p className="text-sm text-[var(--color-foreground)]/60 leading-relaxed font-medium mb-12 max-w-xs">
            Partisipasi Anda sangat berarti bagi masa depan Ekstrakurikuler IT SMKN 20 Jakarta. Pilihan Anda telah tersimpan dengan aman dan rahasia.
          </p>
          
          <div className="w-full flex justify-center">
            <button 
              onClick={() => router.push('/')} 
              className="group w-full max-w-xs bg-[var(--color-brand)] text-white py-2 pl-6 pr-2 rounded-full hover:bg-[var(--color-brand-hover)] transition-all duration-500 ease-vanguard active:scale-[0.98] flex justify-between items-center shadow-lg shadow-[var(--color-brand)]/30"
            >
              <span className="font-medium text-sm tracking-wide">
                Selesai & Keluar
              </span>
              
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-vanguard group-hover:scale-105 group-hover:bg-white/30">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}
