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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header & Form Pencarian */}
        <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-600 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lacak Status Aspirasi</h1>
          <p className="text-gray-600 mb-8">Masukkan ID Aspirasi Anda untuk melihat progres tindak lanjut dari MPA HIMAKOM.</p>
          
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
            <input 
              type="text" 
              name="id_aspirasi" 
              placeholder="Contoh: MPA-2026-001" 
              required 
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border uppercase"
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium shadow-sm disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Mencari...' : 'Lacak'}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 text-red-600 text-sm font-medium">{errorMsg}</div>
          )}
        </div>

        {/* Hasil Pencarian */}
        {hasil && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6 gap-4">
              <div>
                <div className="text-sm text-gray-500 font-semibold mb-1">ID Aspirasi</div>
                <div className="text-2xl font-bold text-blue-600 font-mono">{hasil.data.id_aspirasi}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 font-semibold mb-1">Status Terkini</div>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold tracking-wide">
                  {hasil.data.status_current}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-gray-500 font-semibold mb-2">Isi Aspirasi ({hasil.data.kategori.nama_kategori})</div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-800">
                {hasil.data.isi_aspirasi}
              </div>
            </div>

            {/* Timeline Progres */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline Progres</h3>
              <div className="space-y-6">
                {/* Status Awal (SUBMITTED) */}
                <div className="relative flex gap-4">
                  <div className="absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-blue-200"></div>
                  <div className="relative z-10 w-5 h-5 rounded-full bg-blue-600 shrink-0 mt-0.5"></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">SUBMITTED</div>
                    <div className="text-xs text-gray-500">
                      {new Date(hasil.data.tanggal_masuk).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Aspirasi berhasil diterima oleh sistem.</div>
                  </div>
                </div>

                {/* Histori Status Berikutnya */}
                {hasil.histori?.map((item: any, index: number) => (
                  <div key={index} className="relative flex gap-4">
                    {index !== hasil.histori.length - 1 && (
                      <div className="absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-blue-200"></div>
                    )}
                    <div className="relative z-10 w-5 h-5 rounded-full bg-blue-600 shrink-0 mt-0.5 shadow-[0_0_0_4px_white]"></div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.status_ke}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.waktu_ubah).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                      </div>
                      {item.catatan && (
                        <div className="text-sm text-gray-600 mt-1 italic">"{item.catatan}"</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}