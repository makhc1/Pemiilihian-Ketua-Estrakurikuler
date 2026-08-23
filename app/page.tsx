'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { detectIncognito } from 'detectincognitojs'

export default function Login() {
  const [nis, setNis] = useState('')
  const [loading, setLoading] = useState(false)
  const [incognitoBlocked, setIncognitoBlocked] = useState(false)
  const [errorState, setErrorState] = useState<{ title: string, message: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkIncognito = async () => {
      try {
        const result = await detectIncognito();
        if (result.isPrivate) {
          setIncognitoBlocked(true);
        }
      } catch (e) {
        console.error('Failed to detect incognito:', e);
      }
    };
    checkIncognito();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && errorState) {
        setErrorState(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errorState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (localStorage.getItem('device_locked') === 'true') {
      setErrorState({
        title: 'Perangkat Terkunci',
        message: 'Perangkat ini sudah digunakan untuk memilih. Satu perangkat hanya dapat memancarkan satu suara untuk menjamin keadilan.'
      });
      return;
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .eq('nis', nis.trim())
      .single()

    setLoading(false)

    if (error || !data) {
      setErrorState({
        title: 'NIS Tidak Ditemukan',
        message: 'Nomor Induk Siswa yang dimasukkan tidak terdaftar dalam database anggota Ekstrakurikuler ICT SMKN 20 Jakarta.'
      });
      return
    }

    if (data.has_voted) {
      setErrorState({
        title: 'Suara Telah Terekam',
        message: 'Sistem mencatat bahwa NIS ini telah digunakan untuk memilih.'
      });
    } else {
      localStorage.setItem('voter_nis', data.nis)
      router.push('/vote')
    }
  }

  if (incognitoBlocked) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-8 bg-black text-white">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50">Incognito Mode Detected</p>
          <h2 className="text-3xl font-light tracking-tight">Otorisasi Ditolak</h2>
          <p className="text-white/60 text-sm leading-relaxed">Sistem mendeteksi akses privat. Silakan gunakan sesi browser standar untuk menjamin integritas pemilihan.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[100dvh] bg-[var(--color-background)] flex flex-col md:flex-row overflow-hidden relative">

        {/* Background Image & Ambience */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/inilogo.jpg"
            alt="Background ICT SMKN 20"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Mobile dark overlay so image is visible but text is readable */}
          <div className="absolute inset-0 bg-black/40 md:bg-transparent"></div>
          {/* Gradient for desktop to blend image into form area */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-white/90 to-white"></div>
        </div>

        {/* Left: Editorial Typography (The Editorial Split) */}
        <div className="w-full md:w-1/2 p-8 pt-16 md:p-16 lg:p-24 flex flex-col justify-center md:justify-between relative z-10 opacity-0 animate-fade-up">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1] text-white drop-shadow-2xl mb-6 md:mb-0">
              Information<br />
              Communication<br />
              Technology.
            </h1>
          </div>

          <div className="mt-4 md:mt-0 max-w-sm">
            <p className="text-base text-white/90 leading-relaxed font-medium drop-shadow-md">
              Tentukan arah baru Ekstrakurikuler ICT SMKN 20 Jakarta. Sistem e-voting ini dirancang untuk memastikan setiap suara transparan, aman, dan rahasia.
            </p>
          </div>
        </div>

        {/* Right: The Doppelrand Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-10">

          {/* Outer Shell (Double-Bezel Architecture) */}
          <div className="w-full max-w-md bg-white/20 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white/40 shadow-[0_30px_60px_rgba(0,0,0,0.15)] opacity-0 animate-fade-up-1">
            {/* Inner Core */}
            <div className="bg-white/50 rounded-[calc(2.5rem-0.5rem)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] p-8 sm:p-12 relative overflow-hidden backdrop-blur-md">

              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] mb-2">Bilik Suara Digital</h2>
                <p className="text-sm text-[var(--color-foreground)]/60 mb-10">Masukkan identitas Anda untuk melanjutkan.</p>

                <form onSubmit={handleLogin} className="space-y-8">
                  <div className="group relative">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground)]/50 mb-3 ml-1 transition-colors group-focus-within:text-[var(--color-brand)]">
                      Nomor Induk Siswa (NIS)
                    </label>
                    <input
                      className="w-full pb-3 bg-transparent text-[var(--color-foreground)] border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-brand)] transition-colors placeholder:text-[var(--color-foreground)]/20 text-2xl sm:text-3xl font-medium tracking-tight"
                      placeholder="Contoh: 12345"
                      value={nis}
                      onChange={e => setNis(e.target.value)}
                      required
                      inputMode="numeric"
                    />
                  </div>

                  {/* Nested CTA & "Island" Button Architecture */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-[var(--color-brand)] text-white py-2 pl-6 pr-2 rounded-full hover:bg-[var(--color-brand-hover)] transition-all duration-500 ease-vanguard active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-between items-center mt-12 shadow-lg shadow-[var(--color-brand)]/30"
                  >
                    <span className="font-medium text-sm tracking-wide">
                      {loading ? 'Memverifikasi Data...' : 'Masuk dan Voting'}
                    </span>

                    {/* The Button-in-Button Trailing Icon */}
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-vanguard group-hover:scale-105 group-hover:bg-white/30">
                      {loading ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white transform transition-transform duration-500 ease-vanguard group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Modal (Soft Structuralism) */}
      {errorState && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity" onClick={() => setErrorState(null)}></div>

          {/* Outer Shell */}
          <div className="relative bg-white/20 backdrop-blur-3xl p-1.5 rounded-[2rem] border border-white/40 shadow-[0_30px_60px_rgba(0,0,0,0.15)] w-full max-w-sm z-10 opacity-0 animate-fade-up">
            {/* Inner Core */}
            <div className="bg-white/70 backdrop-blur-md rounded-[calc(2rem-0.375rem)] p-8 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-black mb-3">{errorState.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed mb-8">{errorState.message}</p>

                <button
                  autoFocus
                  onClick={() => setErrorState(null)}
                  className="w-full bg-[var(--color-brand)] text-white font-medium text-sm py-4 rounded-xl hover:bg-[var(--color-brand-hover)] transition-all active:scale-[0.98] outline-none"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
