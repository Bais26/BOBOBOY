import React from "react";
import {
  MapPinIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const AbsensiPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card */}
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-5xl font-bold mb-2">15.57.40</h2>
          <p className="text-gray-400 mb-8">
            Senin, 26 Agustus 2024
          </p>

          <div className="mx-auto max-w-sm border border-blue-200 rounded-xl p-4 text-sm text-blue-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5" />
              <span className="font-medium">Lokasi Saat Ini</span>
            </div>
            <p className="font-semibold">PT Cybers Blitz Nusantara</p>
            <p>Jl. Asia Afrika No. 123, Bandung</p>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white rounded-2xl shadow-sm p-10">
          <h3 className="text-lg font-semibold mb-6">
            Status Absensi
          </h3>

          <div className="border border-green-300 bg-green-50 rounded-xl p-4 text-center mb-6">
            <div className="flex justify-center items-center gap-2 text-green-600 font-semibold">
              <CheckCircleIcon className="w-5 h-5" />
              <span>Sudah Absen Masuk</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Waktu: 08:00 WIB
            </p>
          </div>

          <div className="flex gap-4">
            <button
              disabled
              className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Absen Masuk
            </button>

            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Absen Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsensiPage;
