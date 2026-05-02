import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function TransparansiPublik() {
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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Transparansi */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Transparansi Aspirasi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pantauan *real-time* kinerja Majelis Perwakilan Anggota (MPA) HIMAKOM dalam mengelola dan menindaklanjuti suara mahasiswa.
          </p>
        </div>

        {/* Kartu Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-gray-500 font-medium mb-2">Total Aspirasi Masuk</div>
            <div className="text-5xl font-black text-blue-600">{totalMasuk}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-gray-500 font-medium mb-2">Sedang Diproses</div>
            <div className="text-5xl font-black text-yellow-500">{totalDiproses}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-gray-500 font-medium mb-2">Berhasil Diselesaikan</div>
            <div className="text-5xl font-black text-green-500">{totalSelesai}</div>
          </div>
        </div>

        {/* Etalase Aspirasi yang Terselesaikan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Aspirasi Terkini yang Telah Diselesaikan</h3>
            <p className="text-sm text-gray-500">Identitas pelapor dirahasiakan untuk melindungi privasi mahasiswa.</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {aspirasiSelesai && aspirasiSelesai.length > 0 ? (
              aspirasiSelesai.map((item: any) => (
                <div key={item.id_aspirasi} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                        {item.status_current}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {item.kategori?.nama_kategori}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      {item.id_aspirasi}
                    </div>
                  </div>
                  <p className="text-gray-800 mt-3">{item.isi_aspirasi}</p>
                  <div className="text-xs text-gray-400 mt-4">
                    Diterima pada: {new Date(item.tanggal_masuk).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                Belum ada data aspirasi yang berstatus selesai.
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}