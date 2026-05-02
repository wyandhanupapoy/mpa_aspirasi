import { createClient } from '@supabase/supabase-js';

// Paksa halaman ini menjadi dynamic agar tidak error saat 'npm run build'
// dan memastikan statistik yang ditampilkan selalu real-time.
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Inisialisasi client secara aman
const supabaseAdmin = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function TransparansiPublik() {
  if (!supabaseAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Error: Supabase configuration is missing.</div>;
  }

  // 1. Ambil semua data aspirasi untuk dihitung statistiknya
  const { data: semuaAspirasi } = await supabaseAdmin
    .from('aspirasi')
    .select('status_current, kategori(nama_kategori)');

  // 2. Ambil 10 aspirasi terbaru yang sudah selesai (RESOLVED/CLOSED) untuk etalase publik
  // Tanpa memanggil tabel pelapor sama sekali demi menjaga privasi (Anonimitas Eksternal)
  const { data: aspirasiSelesai } = await supabaseAdmin
    .from('aspirasi')
    .select('id_aspirasi, tanggal_masuk, isi_aspirasi, status_current, kategori(nama_kategori)')
    .in('status_current', ['RESOLVED', 'CLOSED', 'ARCHIVED'])
    .order('tanggal_masuk', { ascending: false })
    .limit(10);

  // Menghitung Statistik Agregat
  const totalMasuk = semuaAspirasi?.length || 0;
  const totalSelesai = semuaAspirasi?.filter(a => 
    ['RESOLVED', 'CLOSED', 'ARCHIVED'].includes(a.status_current)
  ).length || 0;
  const totalDiproses = totalMasuk - totalSelesai;

  return (
    <main className="min-h-screen bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Transparansi */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-[10px] font-black text-green-700 uppercase tracking-[0.2em]">
            Public Transparency Data
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            Monitor <br/>
            <span className="gradient-text">Aspirasi Publik.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Wujud komitmen Majelis Perwakilan Anggota (MPA) dalam menjaga akuntabilitas dan efektivitas tindak lanjut suara mahasiswa.
          </p>
        </div>

        {/* Kartu Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Aspirasi Masuk</div>
            <div className="text-6xl font-black text-blue-600 tracking-tighter mb-2">{totalMasuk}</div>
            <div className="h-1.5 w-12 bg-blue-100 rounded-full mx-auto"></div>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dalam Proses</div>
            <div className="text-6xl font-black text-orange-500 tracking-tighter mb-2">{totalDiproses}</div>
            <div className="h-1.5 w-12 bg-orange-100 rounded-full mx-auto"></div>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Terselesaikan</div>
            <div className="text-6xl font-black text-green-500 tracking-tighter mb-2">{totalSelesai}</div>
            <div className="h-1.5 w-12 bg-green-100 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Etalase Aspirasi yang Terselesaikan */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mt-16">
          <div className="px-10 py-10 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Etalase Resolusi</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">10 Kasus Terkini</p>
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
              Verified by MPA
            </div>
          </div>
          
          <div className="divide-y divide-slate-50">
            {aspirasiSelesai && aspirasiSelesai.length > 0 ? (
              aspirasiSelesai.map((item: any) => (
                <div key={item.id_aspirasi} className="p-10 hover:bg-slate-50/80 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">
                        {item.status_current}
                      </span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {item.kategori?.nama_kategori}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-300 font-mono tracking-tighter border border-slate-100 px-2 py-1 rounded-lg">
                      {item.id_aspirasi}
                    </div>
                  </div>
                  <p className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    "{item.isi_aspirasi}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-6">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Public Release &bull; {new Date(item.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="text-5xl mb-6 grayscale opacity-20">📂</div>
                <div className="text-slate-400 font-black uppercase tracking-widest text-sm">Belum Ada Resolusi Publik</div>
                <p className="text-slate-300 text-xs mt-2 font-medium">Data akan muncul secara otomatis setelah status mencapai 'RESOLVED'.</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-8">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
             &copy; {new Date().getFullYear()} HIMAKOM Intelligence System
           </p>
        </div>

      </div>
    </main>
  );
}