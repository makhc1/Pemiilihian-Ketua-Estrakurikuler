'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cek session saat pertama load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session)
      setLoading(false)
    })

    // Listen kalau ada perubahan status login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand)] font-medium">Memuat...</div>
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4 font-sans selection:bg-[var(--color-surface)] selection:text-[var(--color-brand-hover)]">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl border border-[var(--color-border)] shadow-sm w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--color-surface)] text-[var(--color-brand)] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[var(--color-brand)]/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-[var(--color-foreground)] tracking-tight">Admin Portal</h1>
            <p className="text-[var(--color-foreground)] text-sm mt-2">Area khusus panitia pemilihan (Secure Access)</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">Email Admin</label>
              <input 
                className="w-full p-4 bg-white text-[var(--color-foreground)] border border-[var(--color-border)] focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-slate-700"
                type="email" 
                placeholder="admin@ict.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">Password</label>
              <input 
                className={`w-full p-4 bg-white text-[var(--color-foreground)] border ${error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)] focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)]'} rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-slate-700`}
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-brand)] text-white font-medium text-base py-4 rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors active:scale-[0.99] disabled:opacity-50"
          >
            Masuk Dashboard
          </button>
        </form>
      </div>
    )
  }
  
  return (
    <div className="bg-[var(--color-background)] min-h-screen flex flex-col md:flex-row pb-24 md:pb-0 relative font-sans text-[var(--color-foreground)] selection:bg-[var(--color-surface)] selection:text-[var(--color-brand-hover)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[var(--color-border)] h-screen sticky top-0 print:hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-brand)] rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-semibold text-lg text-[var(--color-foreground)] tracking-tight">Admin E-Voting</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[var(--color-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)] rounded-xl transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Laporan & Berita Acara
          </Link>
          <Link href="/admin/candidates" className="flex items-center gap-3 px-4 py-3 text-[var(--color-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)] rounded-xl transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Kandidat
          </Link>
          <Link href="/admin/manage" className="flex items-center gap-3 px-4 py-3 text-[var(--color-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)] rounded-xl transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Data Pemilih
          </Link>
          <a href="/live" target="_blank" className="flex items-center gap-3 px-4 py-3 text-[var(--color-brand)] bg-[var(--color-surface)] rounded-xl transition-colors font-medium mt-4 border border-[var(--color-brand)]/20 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Buka Layar Live
          </a>
        </nav>
        <div className="p-4 border-t border-[var(--color-border)]">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden bg-slate-50/50 print:bg-white">
        {children}
      </main>

      <div className="md:hidden fixed bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md border border-[var(--color-border)] rounded-2xl flex justify-around p-2 z-50 shadow-sm print:hidden">
        <Link href="/admin" className="flex flex-col items-center p-2 text-[var(--color-foreground)] hover:text-[var(--color-brand)] active:text-[var(--color-brand)] transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        </Link>
        <Link href="/admin/candidates" className="flex flex-col items-center p-2 text-[var(--color-foreground)] hover:text-[var(--color-brand)] active:text-[var(--color-brand)] transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </Link>
        <Link href="/admin/manage" className="flex flex-col items-center p-2 text-[var(--color-foreground)] hover:text-[var(--color-brand)] active:text-[var(--color-brand)] transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </Link>
      </div>
    </div>
  )
}


