'use client'

import { useState, useEffect } from 'react';
import { updatePriorityScore } from '../actions/updateScore';

export default function PriorityScoring({ idAspirasi, skorAwal }: { idAspirasi: string, skorAwal: number | null }) {
  // Nilai masing-masing parameter (skala 1-4) sesuai Blueprint
  const [params, setParams] = useState({
    jumlah: 1, urgensi: 1, dampak: 1, sensitivitas: 1, bukti: 1, berulang: 1
  });
  const [skorAkhir, setSkorAkhir] = useState(skorAwal || 0);
  const [isSaving, setIsSaving] = useState(false);

  // Fungsi Kalkulasi sesuai Bobot Blueprint
  useEffect(() => {
    // Formula: (Nilai / 4) * Bobot Maksimal
    const hitungJumlah = (params.jumlah / 4) * 25; // Bobot 25%
    const hitungUrgensi = (params.urgensi / 4) * 20; // Bobot 20%
    const hitungDampak = (params.dampak / 4) * 20; // Bobot 20%
    const hitungSensitivitas = (params.sensitivitas / 4) * 15; // Bobot 15%
    const hitungBukti = (params.bukti / 4) * 10; // Bobot 10%
    const hitungBerulang = (params.berulang / 4) * 10; // Bobot 10%

    const total = hitungJumlah + hitungUrgensi + hitungDampak + hitungSensitivitas + hitungBukti + hitungBerulang;
    setSkorAkhir(Math.round(total));
  }, [params]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePriorityScore(idAspirasi, skorAkhir);
      alert('Skor Prioritas berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan skor');
    } finally {
      setIsSaving(false);
    }
  };

  // Menentukan Level Routing berdasarkan Skor (Blueprint 7.3)
  const getLevelInfo = (skor: number) => {
    if (skor >= 81) return { label: 'CRITICAL', color: 'bg-red-600', text: 'Darurat! Langsung eskalasi ke Ketua MPA (Sidang Darurat 24 jam).' };
    if (skor >= 61) return { label: 'HIGH', color: 'bg-orange-500', text: 'Prioritas Tinggi. Disposisi 1 HK, Rapat komisi 3 HK.' };
    if (skor >= 41) return { label: 'MEDIUM', color: 'bg-yellow-500', text: 'Prioritas Sedang. Alur normal, disposisi 3 HK.' };
    return { label: 'LOW', color: 'bg-green-500', text: 'Rendah. Proses dalam batch mingguan (SLA 5 HK).' };
  };

  const level = getLevelInfo(skorAkhir);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-gray-900">Kalkulator Priority Score</h2>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-bold uppercase">{level.label}</div>
            <div className="text-2xl font-black text-gray-900">{skorAkhir} <span className="text-sm font-normal text-gray-500">/ 100</span></div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving || skorAkhir === skorAwal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow disabled:bg-gray-300 transition-colors"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Skor'}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded border border-gray-100">{level.text}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Param 1: Jumlah Terdampak */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Jumlah Terdampak (25%)</label>
          <select className="w-full border p-2 rounded" value={params.jumlah} onChange={(e) => setParams({...params, jumlah: Number(e.target.value)})}>
            <option value="1">1-5 orang</option>
            <option value="2">6-20 orang</option>
            <option value="3">21-50 orang</option>
            <option value="4">&gt; 50 orang</option>
          </select>
        </div>
        {/* Param 2: Urgensi Waktu */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Urgensi Waktu (20%)</label>
          <select className="w-full border p-2 rounded" value={params.urgensi} onChange={(e) => setParams({...params, urgensi: Number(e.target.value)})}>
            <option value="1">Tidak Mendesak</option>
            <option value="2">Semester Ini</option>
            <option value="3">Bulan Ini</option>
            <option value="4">Minggu Ini</option>
          </select>
        </div>
        {/* Param 3: Dampak Akademik */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Dampak Akademik (20%)</label>
          <select className="w-full border p-2 rounded" value={params.dampak} onChange={(e) => setParams({...params, dampak: Number(e.target.value)})}>
            <option value="1">Tidak Ada</option>
            <option value="2">Ringan</option>
            <option value="3">Sedang</option>
            <option value="4">Kritis</option>
          </select>
        </div>
        {/* Param 4: Sensitivitas */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Sensitivitas Isu (15%)</label>
          <select className="w-full border p-2 rounded" value={params.sensitivitas} onChange={(e) => setParams({...params, sensitivitas: Number(e.target.value)})}>
            <option value="1">Umum</option>
            <option value="2">Perlu Konfirmasi</option>
            <option value="3">Sensitif</option>
            <option value="4">Sangat Kritis</option>
          </select>
        </div>
        {/* Param 5: Kelengkapan Bukti */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Kelengkapan Bukti (10%)</label>
          <select className="w-full border p-2 rounded" value={params.bukti} onChange={(e) => setParams({...params, bukti: Number(e.target.value)})}>
            <option value="1">Tidak Ada</option>
            <option value="2">Minimal</option>
            <option value="3">Cukup</option>
            <option value="4">Sangat Lengkap</option>
          </select>
        </div>
        {/* Param 6: Pola Berulang */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Pola Berulang (10%)</label>
          <select className="w-full border p-2 rounded" value={params.berulang} onChange={(e) => setParams({...params, berulang: Number(e.target.value)})}>
            <option value="1">Pertama Kali</option>
            <option value="2">Pernah Muncul</option>
            <option value="3">Berulang</option>
            <option value="4">Kronis (Terus-menerus)</option>
          </select>
        </div>
      </div>
    </div>
  );
}