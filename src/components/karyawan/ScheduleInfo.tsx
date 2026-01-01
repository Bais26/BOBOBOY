import React from "react";

const ScheduleInfo = () => {
  return (
    <div className="rounded-xl border border-blue-300 bg-blue-50 p-6 text-blue-700">
      <h2 className="font-semibold mb-3">Informasi Jadwal Kerja</h2>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Jam kerja: 08:00 - 17:00 WIB</li>
        <li>Istirahat: 12:00 - 13:00 WIB</li>
        <li>Toleransi: 15 menit</li>
        <li>Libur: Sabtu & Minggu</li>
      </ul>
    </div>
  );
};

export default ScheduleInfo;
