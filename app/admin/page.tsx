import StatusUpdater from '../components/StatusUpdater';
import { createClient } from '@supabase/supabase-js';

// Paksa halaman ini menjadi dynamic agar tidak error saat 'npm run build'
// dan memastikan data yang ditampilkan selalu terbaru (bukan hasil cache build).
export const dynamic = 'force-dynamic';

// Menggunakan Service Role Key di Server Component agar bisa membaca semua data
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminDashboard() {
  // Mengambil data aspirasi dan melakukan JOIN ke tabel pelapor & kategori
  const { data: daftarAspirasi, error } = await supabaseAdmin
    .from('aspirasi')
    .select(`
      id_aspirasi,
      tanggal_masuk,
      isi_aspirasi,
      status_current,
      is_anonim,
      pelapor ( nama, nim, angkatan ),
      kategori ( nama_kategori )
    `)
    .order('tanggal_masuk', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Gagal memuat data: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin MPA</h1>
            <p className="text-gray-600">Sistem Pengelolaan Aspirasi HIMAKOM</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow">
            Total Aspirasi: {daftarAspirasi?.length || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Aspirasi</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Pelapor</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Isi Aspirasi</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {daftarAspirasi?.map((item: any) => (
                  <tr key={item.id_aspirasi} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                      {item.id_aspirasi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.tanggal_masuk).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {item.is_anonim ? (
                        <span className="italic text-gray-400">Anonim</span>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900">{item.pelapor?.nama}</div>
                          <div className="text-xs text-gray-500">{item.pelapor?.nim}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {item.kategori?.nama_kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={item.isi_aspirasi}>
                      {item.isi_aspirasi}
                    </td>
                    <td className="px-6 py-4">
    <StatusUpdater 
      idAspirasi={item.id_aspirasi} 
      statusSaatIni={item.status_current} 
    />
  </td>
  <td className="px-6 py-4 text-center">
     <a 
       href={`/admin/aspirasi/${item.id_aspirasi}`} 
       className="inline-block bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
     >
       Detail
     </a>
   </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {daftarAspirasi?.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Belum ada aspirasi yang masuk.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}