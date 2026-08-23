'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ManageCandidates() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  
  const [name, setName] = useState('')
  const [vision, setVision] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const fetchCandidates = async () => {
    setLoading(true)
    const { data } = await supabase.from('candidates').select('*').order('name')
    setCandidates(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    const { error } = await supabase.from('candidates').insert([{
      name,
      vision_mission: vision,
      photo_url: photoUrl
    }])
    
    setAdding(false)
    if (error) {
      alert("Gagal menambah kandidat: " + error.message)
    } else {
      setName('')
      setVision('')
      setPhotoUrl('')
      fetchCandidates()
    }
  }

  const handleDelete = async (id: string, candName: string) => {
    if (confirm(`Yakin ingin menghapus kandidat ${candName}? (Seluruh suara untuk kandidat ini akan terhapus)`)) {
      const { error } = await supabase.from('candidates').delete().eq('id', id)
      if (error) {
        alert("Gagal menghapus: " + error.message)
      } else {
        fetchCandidates()
      }
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-semibold text-[var(--color-foreground)] mb-2">Kelola Kandidat</h1>
      <p className="text-[var(--color-foreground)] mb-8">Tambahkan dan atur data calon ketua ICT.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Tambah Kandidat */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6">Tambah Paslon</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Nama Kandidat</label>
                <input 
                  className="w-full p-3 bg-white text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl focus:ring-1 focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] outline-none transition-all placeholder:text-slate-700" 
                  value={name} onChange={e => setName(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Visi Misi</label>
                <textarea 
                  className="w-full p-3 bg-white text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl focus:ring-1 focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] outline-none transition-all placeholder:text-slate-700 h-24 resize-none" 
                  value={vision} onChange={e => setVision(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">URL Foto (Opsional)</label>
                <input 
                  className="w-full p-3 bg-white text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl focus:ring-1 focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] outline-none transition-all placeholder:text-slate-700 text-sm" 
                  placeholder="https://contoh.com/foto.jpg"
                  value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} 
                />
              </div>
              <button 
                type="submit" disabled={adding}
                className="w-full bg-[var(--color-brand)] text-white font-medium py-3 rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50 mt-2"
              >
                {adding ? 'Menyimpan...' : 'Simpan Kandidat'}
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Kandidat */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] min-h-[400px]">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6">Daftar Kandidat Saat Ini</h2>
            
            {loading ? (
              <div className="text-[var(--color-foreground)] text-center py-10">Memuat data...</div>
            ) : candidates.length === 0 ? (
              <div className="text-[var(--color-foreground)] text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-[var(--color-border)]">Belum ada kandidat.</div>
            ) : (
              <div className="space-y-4">
                {candidates.map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-4 border border-[var(--color-border)] rounded-xl hover:shadow-sm hover:border-[var(--color-brand)]/50 transition-all bg-white group">
                    <div 
                      className="w-16 h-16 bg-slate-50 rounded-xl bg-cover bg-center shrink-0 border border-[var(--color-border)]"
                      style={{backgroundImage: c.photo_url ? `url(${c.photo_url})` : 'none'}}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-[var(--color-foreground)] truncate">{c.name}</h3>
                      <p className="text-[var(--color-foreground)] text-sm truncate">{c.vision_mission}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                      title="Hapus Kandidat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

