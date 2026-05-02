'use server'

import { createClient } from '@supabase/supabase-js';

// Menggunakan Admin Client agar sistem bisa mencari data, 
// tetapi kita mengatur (membatasi) data apa saja yang dikembalikan ke publik.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getStatusAspirasi(id_aspirasi: string) {
  // 1. Cari Aspirasi
  const { data, error } = await supabaseAdmin
    .from('aspirasi')
    .select(`
      id_aspirasi,
      tanggal_masuk,
      isi_aspirasi,
      status_current,
      kategori ( nama_kategori )
    `)
    .eq('id_aspirasi', id_aspirasi.trim())
    .single();

  if (error || !data) {
    return { success: false, message: 'ID Aspirasi tidak ditemukan. Pastikan format penulisan benar (Contoh: MPA-2026-001).' };
  }

  // 2. Ambil Timeline Riwayat Status
  const { data: histori } = await supabaseAdmin
    .from('status_history')
    .select('status_ke, waktu_ubah, catatan')
    .eq('id_aspirasi', id_aspirasi.trim())
    .order('waktu_ubah', { ascending: true }); // Diurutkan dari yang paling lama ke baru untuk timeline

  return { success: true, data, histori };
}