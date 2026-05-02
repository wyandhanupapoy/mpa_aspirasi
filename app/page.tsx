'use client'

import { useState } from 'react';
import { submitAspirasi } from './actions/submitAspirasi';

export default function FormulirAspirasi() {
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const result = await submitAspirasi(formData);
      if (result.success) {
        setSuccessId(result.id_aspirasi);
      }
    } catch (error) {
      alert("Gagal mengirim aspirasi: " + error);
    } finally {
      setLoading(false);
    }
  }

  if (successId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md text-center border border-gray-100 animate-fade-in">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Berhasil!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Aspirasi Anda telah terenkripsi dan tersimpan dengan aman dalam sistem kami.</p>
          <div className="bg-gray-50 p-5 rounded-2xl font-mono text-xl font-bold text-blue-600 tracking-widest border border-dashed border-blue-200 select-all">
            {successId}
          </div>
          <p className="text-xs text-gray-400 mt-6 uppercase font-bold tracking-widest">Simpan ID di atas untuk pelacakan</p>
          <button onClick={() => window.location.reload()} className="mt-8 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            Kirim Aspirasi Lainnya &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-50/50 blur-[100px]"></div>
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Portal Resmi MPA HIMAKOM</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter leading-none">
            Suara Anda, <br/>
            <span className="gradient-text">Masa Depan Kita.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            Sampaikan aspirasi, keluhan, atau ide strategis Anda untuk HIMAKOM yang lebih inklusif dan transparan.
          </p>
          
          <div className="flex justify-center gap-3 mt-10">
             <a href="/lacak" className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all premium-shadow">Lacak Status</a>
             <a href="/transparansi" className="text-sm font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all border border-blue-100">Transparansi Publik</a>
          </div>
        </div>

        <div className="glass p-8 md:p-12 rounded-[32px] premium-shadow border border-white/50 relative overflow-hidden group animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">NIM</label>
                <input type="text" name="nim" required className="w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 border transition-all placeholder:text-gray-400" placeholder="Contoh: 221511001" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Nama Lengkap</label>
                <input type="text" name="nama" required className="w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 border transition-all" placeholder="Nama sesuai KTM" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
               <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Kontak (WA/Email)</label>
                <input type="text" name="kontak" required className="w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 border transition-all" placeholder="Untuk notifikasi progres" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Angkatan</label>
                <input type="text" name="angkatan" placeholder="Contoh: 2024" required className="w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 border transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Kategori Aspirasi</label>
              <select name="kategori" required className="w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 border transition-all appearance-none cursor-pointer">
                <option value="1">🎓 Akademik & Kurikulum</option>
                <option value="2">🏢 Sarana & Prasarana</option>
                <option value="3">🤝 Organisasi & Kemahasiswaan</option>
                <option value="4">📢 Komunikasi & Informasi</option>
                <option value="5">⚖️ Advokasi & Kebijakan</option>
                <option value="6">💸 Kesejahteraan Mahasiswa</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Detail Aspirasi</label>
              <textarea name="isi_aspirasi" rows={5} required className="w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 border transition-all" placeholder="Ceritakan detail aspirasi, masalah, atau usulan Anda secara lengkap..."></textarea>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="mt-1">
                <input type="checkbox" name="is_anonim" id="is_anonim" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer" />
              </div>
              <label htmlFor="is_anonim" className="text-sm text-gray-700 cursor-pointer select-none">
                <span className="font-bold block text-blue-800">Kirim sebagai Anonim</span>
                Identitas Anda hanya akan dapat diakses oleh Admin/Komisi MPA untuk keperluan verifikasi dan tidak akan dipublikasikan.
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:bg-gray-400 transition-all hover:scale-[1.01] active:scale-[0.99]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
              ) : 'Kirim Aspirasi Sekarang'}
            </button>
          </form>
        </div>
        
        <footer className="mt-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} MPA HIMAKOM POLBAN &bull; Crafted with integrity
        </footer>
      </div>
    </main>
  );
}