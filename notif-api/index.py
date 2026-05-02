from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI(title="MPA Notification Service")

# Model Data Payload dari Next.js
class NotifPayload(BaseModel):
    id_aspirasi: str
    nama: str | None = "Mahasiswa"
    kontak: str | None = None
    status_lama: str
    status_baru: str
    pesan: str

import os

# Konfigurasi Email (Gunakan App Password Gmail)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "wyandhanupapoy@gmail.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "mrihegzhmujtdsxv")

def kirim_email(tujuan: str, subjek: str, isi_pesan: str):
    try:
        msg = MIMEMultipart()
        msg['From'] = f"MPA HIMAKOM <{SENDER_EMAIL}>"
        msg['To'] = tujuan
        msg['Subject'] = subjek

        msg.attach(MIMEText(isi_pesan, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email berhasil dikirim ke {tujuan}")
    except Exception as e:
        print(f"❌ Gagal mengirim email: {e}")

@app.post("/webhook/notify")
async def receive_webhook(payload: NotifPayload, background_tasks: BackgroundTasks):
    print("=========================================")
    print(f"DATA MASUK: {payload}") # <-- Tambahkan baris ini
    print("=========================================")
    
    if payload.kontak and "@" in payload.kontak:
        subjek = f"Update Status Aspirasi MPA - {payload.id_aspirasi}"
        isi_email = f"""
        Halo {payload.nama},
        
        Aspirasi Anda dengan ID {payload.id_aspirasi} telah diperbarui.
        Status saat ini: {payload.status_baru}
        
        Pesan dari sistem: {payload.pesan}
        
        Terima kasih atas partisipasi Anda dalam membangun HIMAKOM yang lebih baik.
        Anda dapat melacak detailnya di Portal Aspirasi kami.
        
        Salam,
        Majelis Perwakilan Anggota (MPA)
        HIMAKOM POLBAN
        """
        
        # Eksekusi pengiriman email di background agar tidak memblokir respon ke Next.js
        background_tasks.add_task(kirim_email, payload.kontak, subjek, isi_email)
        return {"status": "success", "message": "Email masuk antrean pengiriman"}
    
    return {"status": "ignored", "message": "Kontak bukan email atau kosong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)