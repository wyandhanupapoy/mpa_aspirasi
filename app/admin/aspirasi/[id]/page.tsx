import PriorityScoring from '@/app/components/PriorityScoring';
import { createClient } from '@supabase/supabase-js';
import StatusUpdater from '@/app/components/StatusUpdater';

// Paksa halaman ini menjadi dynamic agar tidak error saat 'npm run build'
// karena ini adalah dynamic route yang butuh data dari Supabase.
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Inisialisasi client secara aman. Jika env var kosong, client akan null 
// sehingga tidak menyebabkan crash saat 'module evaluation' di Vercel build.
const supabaseAdmin = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Ubah tipe data params menjadi Promise
export default async function DetailAspirasi({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Bongkar (unwrap) params menggunakan await sebelum digunakan
  const { id } = await params;

  if (!supabaseAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Error: Supabase configuration is missing.</div>;
  }

  // 2. Ambil Data Aspirasi beserta Pelapor dan Kategori
  const { data: aspirasi, error: errAspirasi } = await supabaseAdmin
    .from('aspirasi')
    .select(`
      *,
      pelapor ( nama, nim, kontak, angkatan ),
      kategori ( nama_kategori )
    `)
    .eq('id_aspirasi', id) // <-- Gunakan variabel 'id' yang sudah dibongkar
    .single();

  // 3. Ambil Riwayat Perubahan Status (Audit Trail)
  const { data: histori } = await supabaseAdmin
    .from('status_history')
    .select('*')
    .eq('id_aspirasi', id) // <-- Gunakan variabel 'id' yang sudah dibongkar
    .order('waktu_ubah', { ascending: false });

  if (errAspirasi || !aspirasi) {
    return <div className="p-8 text-center text-red-500 font-bold">Aspirasi tidak ditemukan.</div>;
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <a href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Dashboard
          </a>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Hash ID</span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-600 border border-slate-200">{aspirasi.id_aspirasi}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Main Content Card */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {aspirasi.kategori?.nama_kategori}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Diterima {new Date(aspirasi.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Isi Aspirasi</h1>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Manajemen Status</div>
                  <StatusUpdater idAspirasi={aspirasi.id_aspirasi} statusSaatIni={aspirasi.status_current}/>
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100 leading-relaxed text-slate-800 font-medium">
                <p className="whitespace-pre-wrap">{aspirasi.isi_aspirasi}</p>
              </div>
            </div>

            {/* Reporter Information Card */}
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Informasi Pelapor</h2>
              </div>

              {aspirasi.is_anonim && (
                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl mb-6 flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <div className="text-xs font-black text-orange-800 uppercase tracking-widest mb-1">Status Anonim Aktif</div>
                    <p className="text-xs text-orange-700 leading-relaxed font-medium">Data ini bersifat rahasia. Sesuai SOP MPA, identitas pelapor hanya boleh digunakan untuk validasi internal dan dilarang disebarluaskan.</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Lengkap</div>
                  <div className="font-bold text-slate-900">{aspirasi.pelapor?.nama}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nomor Induk Mahasiswa</div>
                  <div className="font-bold text-slate-900 font-mono tracking-tight">{aspirasi.pelapor?.nim}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kontak Person</div>
                  <div className="font-bold text-slate-900">{aspirasi.pelapor?.kontak}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Angkatan Akademik</div>
                  <div className="font-bold text-slate-900">{aspirasi.pelapor?.angkatan}</div>
                </div>
              </div>
            </div>

            <PriorityScoring 
              idAspirasi={aspirasi.id_aspirasi} 
              skorAwal={aspirasi.priority_score} 
            />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h2 className="text-xl font-black mb-8 relative z-10">Jejak Progres</h2>
              <div className="space-y-8 relative z-10">
                {histori?.map((item: any, index: number) => (
                  <div key={item.id_history} className="relative flex gap-4 group">
                    {index !== histori.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-32px] w-[2px] bg-white/10 group-hover:bg-blue-500/30 transition-colors"></div>
                    )}
                    <div className="relative z-10 w-5 h-5 rounded-full bg-slate-800 border-4 border-slate-900 ring-2 ring-blue-500/50 shrink-0 mt-1 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                    <div>
                      <div className="text-sm font-black text-white tracking-tight">{item.status_ke}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(item.waktu_ubah).toLocaleString('id-ID', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      {item.catatan && (
                        <div className="text-xs text-slate-400 mt-2 p-3 rounded-xl bg-white/5 border border-white/5 italic font-medium leading-relaxed">
                          "{item.catatan}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!histori || histori.length === 0) && (
                  <div className="text-center py-10 text-slate-500">
                    <div className="text-3xl mb-2">⏳</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Menunggu Validasi</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-200 text-white">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 opacity-80">Panduan Admin</h3>
              <ul className="text-xs space-y-3 font-bold leading-relaxed">
                <li className="flex gap-2"><span>&bull;</span> Verifikasi kelengkapan bukti sebelum mengubah status.</li>
                <li className="flex gap-2"><span>&bull;</span> Gunakan kalkulator prioritas untuk menentukan level urgensi.</li>
                <li className="flex gap-2"><span>&bull;</span> Berikan catatan yang jelas pada setiap perubahan status.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
