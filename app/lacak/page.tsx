'use client'

import { useState } from 'react';
import { getStatusAspirasi } from '../actions/cekStatus';

export default function LacakAspirasi() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasil, setHasil] = useState<any>(null);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setHasil(null);

    const formData = new FormData(event.currentTarget);
    const idAspirasi = formData.get('id_aspirasi') as string;

    try {
      const response = await getStatusAspirasi(idAspirasi);
      if (response.success) {
        setHasil(response);
      } else {
        setErrorMsg(response.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      setErrorMsg('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header & Form Pencarian */}
        <div className="glass p-10 md:p-16 rounded-[40px] premium-shadow border border-white/50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">Lacak Progres.</h1>
          <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto">Masukkan ID unik aspirasi Anda untuk memantau status tindak lanjut secara real-time.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
            <input 
              type="text" 
              name="id_aspirasi" 
              placeholder="CONTOH: MPA-2026-001" 
              required 
              className="flex-1 rounded-2xl border-slate-100 bg-slate-50/50 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-5 border uppercase font-bold text-slate-700 placeholder:text-slate-300 transition-all"
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-300"
            >
              {loading ? 'Searching...' : 'Lacak Sekarang'}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest animate-fade-in">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Hasil Pencarian */}
        {hasil && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 pb-8 mb-8 gap-6">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Aspirasi Terdaftar</div>
                  <div className="text-3xl font-black text-blue-600 font-mono tracking-tighter">{hasil.data.id_aspirasi}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Status Pipeline</div>
                  <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[11px] font-black tracking-[0.1em] shadow-lg shadow-blue-100">
                    {hasil.data.status_current}
                  </span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {hasil.data.kategori.nama_kategori}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 text-slate-800 font-medium leading-relaxed italic">
                  "{hasil.data.isi_aspirasi}"
                </div>
              </div>

              {/* Timeline Progres */}
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Timeline Progres</h3>
                <div className="space-y-10">
                  {/* Status Awal (SUBMITTED) */}
                  <div className="relative flex gap-6 group">
                    <div className="absolute left-[11px] top-8 bottom-[-40px] w-0.5 bg-blue-100 group-hover:bg-blue-200 transition-colors"></div>
                    <div className="relative z-10 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-xl shadow-blue-100 shrink-0 mt-0.5"></div>
                    <div>
                      <div className="text-sm font-black text-slate-900 tracking-tight uppercase">Submitted</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {new Date(hasil.data.tanggal_masuk).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                      </div>
                      <div className="text-sm text-slate-500 mt-2 font-medium">Aspirasi berhasil dienkripsi dan diterima oleh sistem pusat MPA.</div>
                    </div>
                  </div>

                  {/* Histori Status Berikutnya */}
                  {hasil.histori?.map((item: any, index: number) => (
                    <div key={index} className="relative flex gap-6 group">
                      {index !== hasil.histori.length - 1 && (
                        <div className="absolute left-[11px] top-8 bottom-[-40px] w-0.5 bg-blue-100 group-hover:bg-blue-200 transition-colors"></div>
                      )}
                      <div className="relative z-10 w-6 h-6 rounded-full bg-white border-4 border-blue-600 shadow-xl shadow-blue-50 shrink-0 mt-0.5 transition-transform group-hover:scale-110"></div>
                      <div>
                        <div className="text-sm font-black text-slate-900 tracking-tight uppercase">{item.status_ke}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(item.waktu_ubah).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                        </div>
                        {item.catatan && (
                          <div className="text-sm text-slate-600 mt-2 p-4 rounded-2xl bg-blue-50/50 border border-blue-50/50 italic font-medium leading-relaxed">
                            "{item.catatan}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Official Tracking System HIMAKOM</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}