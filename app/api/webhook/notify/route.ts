import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { id_aspirasi, nama, kontak, status_baru, pesan } = payload;

    console.log("=========================================");
    console.log("DATA MASUK (Node.js):", payload);
    console.log("=========================================");

    if (kontak && kontak.includes('@')) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL || 'wyandhanupapoy@gmail.com',
          pass: process.env.SENDER_PASSWORD || 'mrihegzhmujtdsxv',
        },
      });

      const subjek = `Update Status Aspirasi MPA - ${id_aspirasi}`;
      const isi_email = `
        Halo ${nama || 'Mahasiswa'},
        
        Aspirasi Anda dengan ID ${id_aspirasi} telah diperbarui.
        Status saat ini: ${status_baru}
        
        Pesan dari sistem: ${pesan}
        
        Terima kasih atas partisipasi Anda dalam membangun HIMAKOM yang lebih baik.
        Anda dapat melacak detailnya di Portal Aspirasi kami.
        
        Salam,
        Majelis Perwakilan Anggota (MPA)
        HIMAKOM POLBAN
      `;

      await transporter.sendMail({
        from: `"MPA HIMAKOM" <${process.env.SENDER_EMAIL || 'wyandhanupapoy@gmail.com'}>`,
        to: kontak,
        subject: subjek,
        text: isi_email,
      });

      console.log(`✅ Email berhasil dikirim ke ${kontak}`);
      return NextResponse.json({ status: 'success', message: 'Email terkirim' });
    }

    return NextResponse.json({ status: 'ignored', message: 'Kontak bukan email atau kosong' });
  } catch (error: any) {
    console.error("❌ Gagal memproses webhook:", error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
