'use client'

import { useState } from 'react';
import { updateStatus } from '../actions/updateStatus';

export default function StatusUpdater({ 
  idAspirasi, 
  statusSaatIni 
}: { 
  idAspirasi: string, 
  statusSaatIni: string 
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusBaru = e.target.value;
    if (statusBaru === statusSaatIni) return;

    setIsUpdating(true);
    try {
      await updateStatus(idAspirasi, statusBaru, statusSaatIni);
    } catch (error) {
      alert("Gagal memperbarui status!");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Daftar status sesuai Pipeline Blueprint MPA
  const daftarStatus = [
    'SUBMITTED', 'LOGGED', 'VALIDATING', 'VERIFIED', 
    'CLASSIFIED', 'ASSIGNED', 'UNDER REVIEW', 
    'IN DISCUSSION', 'IN FOLLOW UP', 'ESCALATED', 
    'RESOLVED', 'CLOSED', 'ARCHIVED'
  ];

  return (
    <div className="relative inline-block group/status">
      <select 
        value={statusSaatIni}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 border-0 cursor-pointer focus:ring-4 focus:ring-blue-100 transition-all appearance-none pr-8
          ${isUpdating ? 'bg-slate-100 text-slate-400 animate-pulse' : 
            statusSaatIni === 'SUBMITTED' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
            statusSaatIni === 'VERIFIED' ? 'bg-green-50 text-green-700 border border-green-100' :
            statusSaatIni === 'RESOLVED' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' :
            statusSaatIni === 'CLOSED' ? 'bg-slate-900 text-white' :
            'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }
        `}
      >
        {daftarStatus.map((status) => (
          <option key={status} value={status} className="bg-white text-slate-900 font-sans font-bold py-2 uppercase tracking-tighter">
            {status}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}