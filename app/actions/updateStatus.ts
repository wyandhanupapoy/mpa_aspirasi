'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function updateStatus(id_aspirasi: string, status_baru: string, status_lama: string) {
  if (!supabaseAdmin) throw new Error("Supabase configuration is missing");
  // 1. Update status di tabel aspirasi
  const { error: errUpdate } = await supabaseAdmin
    .from('aspirasi')
    .update({ status_current: status_baru })
    .eq('id_aspirasi', id_aspirasi);

  if (errUpdate) throw new Error(errUpdate.message);

  // 2. Catat jejak perubahan di tabel status_history
  const { error: errHistory } = await supabaseAdmin
    .from('status_history')
    .insert([{
      id_aspirasi: id_aspirasi,
      status_dari: status_lama,
      status_ke: status_baru,
      catatan: 'Diperbarui via Dashboard Admin MPA'
    }]);

  if (errHistory) throw new Error(errHistory.message);

  // ====================================================================
  // 3. TRIGGER WEBHOOK UNTUK NOTIFIKASI OTOMATIS (WA / EMAIL)
  // ====================================================================
  try {
    // Ambil data kontak pelapor untuk dikirimkan notifikasi
    // Ambil data kontak pelapor untuk dikirimkan notifikasi
    const { data: infoPelapor } = await supabaseAdmin
      .from('aspirasi')
      .select('pelapor(kontak, nama)')
      .eq('id_aspirasi', id_aspirasi)
      .single();

    // Beri tahu TypeScript untuk membacanya sebagai 'any' agar error hilang
    // Kita juga menambahkan fallback array [0] untuk berjaga-jaga format Supabase
    const dataPelapor = infoPelapor?.pelapor as any;
    const kontakTujuan = dataPelapor?.kontak || (dataPelapor && dataPelapor[0]?.kontak);
    const namaPelapor = dataPelapor?.nama || (dataPelapor && dataPelapor[0]?.nama) || 'Mahasiswa';

    // TODO: Ganti URL ini dengan Endpoint n8n atau FastAPI Anda nanti
    // Ambil host dari headers untuk menentukan URL webhook secara dinamis
    const host = (await import('next/headers')).headers().get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL || `${protocol}://${host}/webhook/notify`;

    // Kita gunakan await agar Vercel tidak mematikan fungsi sebelum fetch selesai
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_aspirasi: id_aspirasi,
        nama: namaPelapor,
        kontak: kontakTujuan,
        status_lama: status_lama,
        status_baru: status_baru,
        pesan: `Halo ${namaPelapor}, status aspirasi Anda (${id_aspirasi}) telah diperbarui menjadi ${status_baru}.`
      })
    }).catch(err => console.error("Gagal mengirim webhook:", err));

  } catch (err) {
    console.error("Gagal menyiapkan data webhook:", err);
  }
  // ====================================================================

  // Refresh halaman admin agar tabel menampilkan data terbaru
  revalidatePath('/admin');
  return { success: true };
}