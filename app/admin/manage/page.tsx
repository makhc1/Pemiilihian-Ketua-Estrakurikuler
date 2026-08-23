'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Papa from 'papaparse'

export default function ManageData() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = () => {
    if (!file) return
    setLoading(true)
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const voters = results.data.map((row: any) => ({
          nis: row.nis,
          pin: Math.floor(1000 + Math.random() * 9000).toString(), // Random 4 digit
          name: row.name || 'Siswa'
        })).filter((v: any) => v.nis)

        if (voters.length === 0) {
          alert('Tidak ada data yang valid. Pastikan header CSV adalah nis dan name.')
          setLoading(false)
          return
        }

        const { error } = await supabase.from('voters').insert(voters)
        if (error) {
          alert("Error: " + error.message)
        } else {
          alert(`Sukses upload ${voters.length} pemilih. Silakan cek Supabase untuk melihat PIN.`)
        }
        setLoading(false)
      },
      error: (error) => {
        alert("Error parsing CSV: " + error.message)
        setLoading(false)
      }
    })
  }

  const handleReset = async () => {
    if (confirm("AWAS! Ini akan mereset seluruh suara. Lanjutkan?")) {
      // Menggunakan RPC agar bisa menembus RLS (Row Level Security)
      const { error } = await supabase.rpc('reset_voting_system')
      
      if (error) {
        alert('Gagal reset: ' + error.message)
      } else {
        alert('Sistem berhasil di-reset.')
        window.location.reload()
      }
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-semibold text-[var(--color-foreground)] mb-8">Kelola Data Pemilihan</h1>
      
      <div className="bg-white p-8 rounded-2xl border border-[var(--color-border)] mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">Upload Daftar Pemilih (CSV)</h2>
        <p className="text-sm text-[var(--color-foreground)] mb-6">Format kolom wajib: <code className="bg-slate-100 px-1 py-0.5 rounded border border-[var(--color-border)]">nis, name</code></p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full sm:w-auto border border-[var(--color-border)] p-2.5 rounded-xl bg-slate-50 text-sm focus:outline-none" />
          <button onClick={handleUpload} disabled={loading} className="w-full sm:w-auto bg-[var(--color-brand)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[var(--color-brand-hover)] disabled:opacity-50 transition-colors">
            {loading ? 'Memproses...' : 'Proses Upload'}
          </button>
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-2xl border border-red-200 shadow-sm">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-6 leading-relaxed">Reset seluruh data pemungutan suara (status memilih dan jumlah vote) menjadi 0. Gunakan ini hanya setelah uji coba dan ingin memulai acara sesungguhnya.</p>
        <button onClick={handleReset} className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors active:scale-[0.98]">
          Reset Seluruh Voting
        </button>
      </div>
    </div>
  )
}


