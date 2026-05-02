import StatusUpdater from '../components/StatusUpdater';
import { createClient } from '@supabase/supabase-js';

// Paksa halaman ini menjadi dynamic agar tidak error saat 'npm run build'
// dan memastikan data yang ditampilkan selalu terbaru (bukan hasil cache build).
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Inisialisasi client secara aman
const supabaseAdmin = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function AdminDashboard() {
  if (!supabaseAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Error: Supabase configuration is missing.</div>;
  }

  // Mengambil data aspirasi dan melakukan JOIN ke tabel pelapor & kategori
  const { data: daftarAspirasi, error } = await supabaseAdmin
    .from('aspirasi')
    .select(`
      id_aspirasi,
      tanggal_masuk,
      isi_aspirasi,
      status_current,
      is_anonim,
      priority_score,
      pelapor ( nama, nim, angkatan ),
      kategori ( nama_kategori )
    `)
    .order('tanggal_masuk', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-100 max-w-md text-center">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f5f9] p-4 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest">Admin Control</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">V1.0.4 - 2026</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard MPA</h1>
            <p className="text-slate-500 font-medium mt-1">Sistem Pengelolaan Aspirasi Strategis HIMAKOM</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 text-center min-w-[140px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Masuk</div>
              <div className="text-3xl font-black text-blue-600">{daftarAspirasi?.length || 0}</div>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 text-center min-w-[140px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">High Priority</div>
              <div className="text-3xl font-black text-orange-500">
                {daftarAspirasi?.filter(a => (a.priority_score || 0) >= 61).length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Table */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-200 group">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <th className="px-8 py-5">ID & Tanggal</th>
                  <th className="px-6 py-5">Pelapor</th>
                  <th className="px-6 py-5">Isu & Kategori</th>
                  <th className="px-6 py-5">Priority</th>
                  <th className="px-6 py-5">Status Alur</th>
                  <th className="px-8 py-5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {daftarAspirasi?.map((item: any) => (
                  <tr key={item.id_aspirasi} className="hover:bg-slate-50/50 transition-all duration-200 group/row">
                    <td className="px-8 py-6">
                      <div className="font-black text-blue-600 font-mono tracking-tighter mb-1">{item.id_aspirasi}</div>
                      <div className="text-[10px] font-bold text-slate-400">
                        {new Date(item.tanggal_masuk).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {item.is_anonim ? (
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">👤</span>
                          <span className="italic font-medium text-slate-400">Anonim Terjaga</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                            {item.pelapor?.nama?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.pelapor?.nama}</div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">{item.pelapor?.nim}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <div className="mb-2">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                          {item.kategori?.nama_kategori}
                        </span>
                      </div>
                      <div className="text-slate-700 font-medium line-clamp-1 max-w-[200px]" title={item.isi_aspirasi}>
                        {item.isi_aspirasi}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black
                        ${(item.priority_score || 0) >= 81 ? 'bg-red-50 text-red-600 border border-red-100' : 
                          (item.priority_score || 0) >= 61 ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          'bg-slate-100 text-slate-600'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${(item.priority_score || 0) >= 61 ? 'animate-pulse bg-current' : 'bg-current opacity-30'}`}></span>
                        {item.priority_score || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <StatusUpdater idAspirasi={item.id_aspirasi} statusSaatIni={item.status_current} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a 
                        href={`/admin/aspirasi/${item.id_aspirasi}`} 
                        className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-blue-600 px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Detail &rarr;
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!daftarAspirasi || daftarAspirasi.length === 0) && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 grayscale opacity-20">📭</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Arsip Kosong</div>
                <p className="text-slate-300 text-xs mt-2">Belum ada aspirasi baru yang masuk ke sistem.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
          <div>MPA Security Protocol Active</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Database Connected</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> SSL Encrypted</span>
          </div>
        </div>
      </div>
    </main>
  );
}