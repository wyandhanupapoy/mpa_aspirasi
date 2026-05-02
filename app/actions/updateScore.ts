'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function updatePriorityScore(id_aspirasi: string, score: number) {
  if (!supabaseAdmin) throw new Error("Supabase configuration is missing");
  const { error } = await supabaseAdmin
    .from('aspirasi')
    .update({ priority_score: score })
    .eq('id_aspirasi', id_aspirasi);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/aspirasi/${id_aspirasi}`);
  revalidatePath('/admin');
  return { success: true };
}