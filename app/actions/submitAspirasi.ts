'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Inisialisasi Supabase Admin (Bypass RLS khusus untuk fungsi Server Backend)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function submitAspirasi(formData: FormData) {
  if (!supabaseAdmin) throw new Error("Supabase configuration is missing");
  const nim = formData.get('nim') as string;
  const nama = formData.get('nama') as string;
  const kontak = formData.get('kontak') as string;
  const angkatan = formData.get('angkatan') as string;
  const kategori = parseInt(formData.get('kategori') as string);
  const isi_aspirasi = formData.get('isi_aspirasi') as string;
  const is_anonim = formData.get('is_anonim') === 'on';

  let final_id_pelapor = '';

  // 1. CEK DULU APAKAH PELAPOR SUDAH ADA (Menggunakan Admin Client)
  const { data: existingPelapor } = await supabaseAdmin
    .from('pelapor')
    .select('id_pelapor')
    .eq('nim', nim);

  if (existingPelapor && existingPelapor.length > 0) {
    // Gunakan ID lama jika NIM sudah terdaftar
    final_id_pelapor = existingPelapor[0].id_pelapor;
  } else {
    // Buat ID baru jika NIM belum terdaftar
    final_id_pelapor = `PLP-${Date.now()}`;
    const { error: errPelapor } = await supabaseAdmin
      .from('pelapor')
      .insert([{ id_pelapor: final_id_pelapor, nim, nama, kontak, angkatan }]);

    if (errPelapor) throw new Error(errPelapor.message);
  }

  // 2. GENERATE ID ASPIRASI BERFORMAT MPA-YYYY-NNN
  const tahun = new Date().getFullYear();
  const randomUrut = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  const id_aspirasi = `MPA-${tahun}-${randomUrut}`;

  // 3. SIMPAN DATA ASPIRASI (Juga menggunakan Admin Client)
  const { error: errAspirasi } = await supabaseAdmin
    .from('aspirasi')
    .insert([{
      id_aspirasi,
      channel: 'Form',
      isi_aspirasi,
      kategori,
      id_pelapor: final_id_pelapor,
      is_anonim,
      status_current: 'SUBMITTED'
    }]);

  if (errAspirasi) throw new Error(errAspirasi.message);

  revalidatePath('/');
  return { success: true, id_aspirasi };
}