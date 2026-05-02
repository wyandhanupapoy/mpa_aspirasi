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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center border-t-4 border-green-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Aspirasi Terkirim!</h2>
          <p className="text-gray-600 mb-4">Aspirasi Anda telah kami terima. Proses selanjutnya akan kami informasikan dalam 2-3 hari kerja.</p>
          <div className="bg-gray-100 p-3 rounded font-mono text-lg font-bold text-blue-600 tracking-wider">
            {successId}
          </div>
          <p className="text-sm text-gray-500 mt-4">Simpan ID di atas untuk melacak status aspirasi Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-600">
        <div className="mb-8 text-center">
          <div className="flex justify-center gap-4 mb-6">
             <a href="/lacak" className="text-sm font-semibold text-blue-600 hover:underline bg-blue-50 px-4 py-2 rounded-full">Lacak Aspirasi Anda</a>
             <a href="/transparansi" className="text-sm font-semibold text-blue-600 hover:underline bg-blue-50 px-4 py-2 rounded-full">Data Transparansi Publik</a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Portal Aspirasi MPA</h1>
          <p className="mt-2 text-gray-600">Himpunan Mahasiswa Komputer POLBAN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">NIM</label>
              <input type="text" name="nim" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="nama" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
             <div>
              <label className="block text-sm font-medium text-gray-700">Kontak (WA/Email)</label>
              <input type="text" name="kontak" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Angkatan</label>
              <input type="text" name="angkatan" placeholder="Contoh: 2024" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori Aspirasi</label>
            <select name="kategori" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="1">Akademik</option>
              <option value="2">Fasilitas</option>
              <option value="3">Organisasi</option>
              <option value="4">Komunikasi</option>
              <option value="5">Advokasi</option>
              <option value="6">Kebijakan</option>
              <option value="7">Kesejahteraan</option>
              <option value="8">Kegiatan</option>
              <option value="9">Etika</option>
              <option value="10">Strategis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Isi Aspirasi</label>
            <textarea name="isi_aspirasi" rows={5} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Ceritakan detail aspirasi, masalah, atau usulan Anda..."></textarea>
          </div>

          <div className="flex items-center">
            <input type="checkbox" name="is_anonim" id="is_anonim" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="is_anonim" className="ml-2 block text-sm text-gray-900">
              Kirim sebagai Anonim (Identitas Anda akan disembunyikan dari publik)
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
            {loading ? 'Memproses...' : 'Kirim Aspirasi'}
          </button>
        </form>
      </div>
    </main>
  );
}