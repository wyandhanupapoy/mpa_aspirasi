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
    <select 
      value={statusSaatIni}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500
        ${isUpdating ? 'bg-gray-200 text-gray-500' : 
          statusSaatIni === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
          statusSaatIni === 'VERIFIED' ? 'bg-green-100 text-green-800' :
          statusSaatIni === 'RESOLVED' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }
      `}
    >
      {daftarStatus.map((status) => (
        <option key={status} value={status} className="bg-white text-gray-900">
          {status}
        </option>
      ))}
    </select>
  );
}