import PriorityScoring from '@/app/components/PriorityScoring';
import { createClient } from '@supabase/supabase-js';
import StatusUpdater from '@/app/components/StatusUpdater';

// Paksa halaman ini menjadi dynamic agar tidak error saat 'npm run build'
// karena ini adalah dynamic route yang butuh data dari Supabase.
export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Ubah tipe data params menjadi Promise
export default async function DetailAspirasi({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Bongkar (unwrap) params menggunakan await sebelum digunakan
  const { id } = await params;

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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        
        <div className="flex justify-between items-center">
          <a href="/admin" className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1">
            &larr; Kembali ke Dashboard
          </a>
          <span className="text-sm text-gray-500">ID: {aspirasi.id_aspirasi}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Isi Aspirasi</h1>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold">
                    {aspirasi.kategori?.nama_kategori}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Status Saat Ini</div>
                  <StatusUpdater idAspirasi={aspirasi.id_aspirasi} statusSaatIni={aspirasi.status_current}/>
                </div>
              </div>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{aspirasi.isi_aspirasi}</p>
              </div>
            </div>

            {/* Informasi Pelapor */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Informasi Pelapor</h2>
              {aspirasi.is_anonim ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm font-medium">
                  🔒 Mahasiswa ini memilih untuk merahasiakan identitasnya (Anonim).
                  Berdasarkan SOP, identitas asli hanya boleh dilihat oleh Admin/Komisi MPA.
                </div>
              ) : null}
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <div className="text-gray-500">Nama Lengkap</div>
                  <div className="font-semibold text-gray-900">{aspirasi.pelapor?.nama}</div>
                </div>
                <div>
                  <div className="text-gray-500">NIM</div>
                  <div className="font-mono font-semibold text-gray-900">{aspirasi.pelapor?.nim}</div>
                </div>
                <div>
                  <div className="text-gray-500">Kontak</div>
                  <div className="font-semibold text-gray-900">{aspirasi.pelapor?.kontak}</div>
                </div>
                <div>
                  <div className="text-gray-500">Angkatan</div>
                  <div className="font-semibold text-gray-900">{aspirasi.pelapor?.angkatan}</div>
                </div>
              </div>
            </div>
            <PriorityScoring 
           idAspirasi={aspirasi.id_aspirasi} 
           skorAwal={aspirasi.priority_score} 
         />
          </div>

          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Riwayat Status</h2>
            <div className="space-y-4">
              {histori?.map((item: any, index: number) => (
                <div key={item.id_history} className="relative flex gap-4">
                  
                  {index !== histori.length - 1 && (
                    <div className="absolute left-2.5 top-8 bottom-[-16px] w-0.5 bg-gray-200"></div>
                  )}
                  <div className="relative z-10 w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-500 shrink-0 mt-0.5"></div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{item.status_ke}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.waktu_ubah).toLocaleString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    {item.catatan && (
                      <div className="text-xs text-gray-600 mt-1 italic">"{item.catatan}"</div>
                    )}
                  </div>
                </div>
              ))}
              {(!histori || histori.length === 0) && (
                <div className="text-sm text-gray-500">Belum ada pembaruan status.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}