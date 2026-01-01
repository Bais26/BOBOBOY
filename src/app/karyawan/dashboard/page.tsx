"use client";
import { useState } from "react";
import { UserIcon, ClockIcon, CalendarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [aktivitasTerakhir] = useState([
    {
      id: 1,
      title: "Absen masuk berhasil",
      location: "Hari ini, 08.48 WIB",
      badge: "HADIR",
    },
    {
      id: 2,
      title: "Absen keluar berhasil",
      location: "Kemarin, 17.08 WIB",
      badge: "HADIR",
    },
    {
      id: 3,
      title: "Terlambat 15 menit",
      location: "Kemarin, 08.13 WIB",
      badge: "HADIR",
    },
    {
      id: 4,
      title: "Absen masuk berhasil",
      location: "3 hari yang lalu, 07.30 WIB",
      badge: "HADIR",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Selamat Datang !</h1>
        <p className="text-blue-100 text-sm mb-1">Semoga Hari ini Anda produktif</p>
        <p className="text-blue-200 text-xs mb-6">Senin 23 September 2024 08.44 WIB</p>

        {/* User Card */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://ui-avatars.com/api/?name=M+Bais+Yufan&background=6366f1&color=fff" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">M Bais Yufan Mardansah</h3>
            <p className="text-xs text-blue-100">Email: frontend developer</p>
            <p className="text-xs text-blue-100">Divisi: IT Development</p>
            <p className="text-xs text-blue-100">Status: <span className="font-medium">WFH</span></p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Kehadiran Bulan Ini */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <UserIcon className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">22</div>
          <div className="text-sm text-gray-500 mt-1">KEHADIRAN</div>
          <div className="text-xs text-gray-400 mt-0.5">BULAN INI</div>
        </div>

        {/* Tidak Hadir */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <UserIcon className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">1</div>
          <div className="text-sm text-gray-500 mt-1">TIDAK HADIR</div>
        </div>

        {/* Keterangan Sakit */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-amber-500">
          <div className="flex items-center justify-between mb-2">
            <CalendarIcon className="w-8 h-8 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-500 mt-1">KETERLAMBATAN</div>
        </div>

        {/* Jam Kerja Hari Ini */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">2.0</div>
          <div className="text-sm text-gray-500 mt-1">JAM KERJA HARI</div>
          <div className="text-xs text-gray-400 mt-0.5">INI</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitas Terakhir */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terakhir</h2>
          </div>

          <div className="space-y-3">
            {aktivitasTerakhir.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                </div>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex-shrink-0">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Absensi Hari Ini */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Status Absensi Hari Ini</h2>
          </div>

          <div className="space-y-3">
            {/* Sudah Absen Masuk */}
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 text-sm">Sudah Absen Masuk</h4>
                <p className="text-xs text-green-700 mt-0.5">Waktu 08:00 WIB</p>
              </div>
            </div>

            {/* Belum Absen Keluar */}
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-sm">Belum Absen Keluar</h4>
                <p className="text-xs text-red-700 mt-0.5">Target 17:00 WIB</p>
              </div>
            </div>

            {/* Button */}
            <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
              Buka Halaman Absensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}