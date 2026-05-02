'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updatePriorityScore(id_aspirasi: string, score: number) {
  const { error } = await supabaseAdmin
    .from('aspirasi')
    .update({ priority_score: score })
    .eq('id_aspirasi', id_aspirasi);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/aspirasi/${id_aspirasi}`);
  revalidatePath('/admin');
  return { success: true };
}