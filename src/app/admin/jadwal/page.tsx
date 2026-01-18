"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, BuildingOfficeIcon, HomeIcon, XMarkIcon, MapPinIcon, CalendarIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import SearchInput from "@/components/shared/SearchInput";
import FilterButton from "@/components/shared/FilterButton";
import Pagination from "@/components/shared/Pagination";
import TambahLokasiWFOPopup from "@/components/admin/TambahLokasiWFOPopup";
import GenerateJadwalPopup from "@/components/admin/GenerateJadwalPopup";

// Simple Modal Component (tanpa Headless UI)
interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

function SimpleModal({ isOpen, onClose, title, subtitle, children, size = "md" }: SimpleModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className=""
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className={`w-full ${sizeClasses[size]} transform rounded-2xl bg-white shadow-xl transition-all`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

type DayStatus = "WFH" | "WFO" | "OFF";

interface RekapWithSchedule {
  id: string;
  nama: string;
  jabatan: string;
  status: "Aktif" | "Nonaktif";
  schedule: {
    senin: DayStatus;
    selasa: DayStatus;
    rabu: DayStatus;
    kamis: DayStatus;
    jumat: DayStatus;
    sabtu: DayStatus;
    minggu: DayStatus;
  };
}

const generateSchedule = () => {
  const statuses: DayStatus[] = ["WFH", "WFO", "OFF"];
  return {
    senin: statuses[Math.floor(Math.random() * 3)],
    selasa: statuses[Math.floor(Math.random() * 3)],
    rabu: statuses[Math.floor(Math.random() * 3)],
    kamis: statuses[Math.floor(Math.random() * 3)],
    jumat: statuses[Math.floor(Math.random() * 3)],
    sabtu: "OFF" as DayStatus,
    minggu: "OFF" as DayStatus,
  };
};

const mockData: RekapWithSchedule[] = Array.from({ length: 100 }, (_, i) => ({
  id: `CBN${234 + i}`,
  nama: ["Bais Yufan", "Muhit Ramadhan", "Yasir", "Zulfan"][i % 4],
  jabatan: "Frontend Developer",
  status: "Aktif",
  schedule: generateSchedule(),
}));

export default function ManagementRekapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(mockData);
  const [isTambahLokasiOpen, setIsTambahLokasiOpen] = useState(false);
  const [isGenerateJadwalOpen, setIsGenerateJadwalOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredData = data.filter((karyawan) => {
    const q = searchQuery.toLowerCase();
    return (
      karyawan.nama.toLowerCase().includes(q) ||
      karyawan.id.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleScheduleChange = (
    karyawanId: string,
    day: keyof RekapWithSchedule["schedule"],
    newStatus: DayStatus
  ) => {
    setData((prevData) =>
      prevData.map((karyawan) =>
        karyawan.id === karyawanId
          ? {
              ...karyawan,
              schedule: {
                ...karyawan.schedule,
                [day]: newStatus,
              },
            }
          : karyawan
      )
    );
  };

  // Render schedule cell dengan dropdown lebih compact
  const renderScheduleCell = (
    karyawan: RekapWithSchedule,
    day: keyof RekapWithSchedule["schedule"]
  ) => {
    const status = karyawan.schedule[day];
    
    return (
      <div className="flex items-center justify-center">
        <div className="relative inline-block">
          <select
            value={status}
            onChange={(e) =>
              handleScheduleChange(karyawan.id, day, e.target.value as DayStatus)
            }
            className={`
              appearance-none cursor-pointer border rounded px-2 py-1 pr-6 text-xs font-medium min-w-[70px]
              ${status === "WFH" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
              ${status === "WFO" ? "bg-green-50 text-green-700 border-green-200" : ""}
              ${status === "OFF" ? "bg-gray-50 text-gray-500 border-gray-200" : ""}
              hover:opacity-80 transition-opacity focus:outline-none focus:ring-1
              ${status === "WFH" ? "focus:ring-blue-400" : ""}
              ${status === "WFO" ? "focus:ring-green-400" : ""}
              ${status === "OFF" ? "focus:ring-gray-300" : ""}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="WFH">WFH</option>
            <option value="WFO">WFO</option>
            <option value="OFF">OFF</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none">
            {status === "WFH" && <HomeIcon className="w-3.5 h-3.5 text-blue-700" />}
            {status === "WFO" && <BuildingOfficeIcon className="w-3.5 h-3.5 text-green-700" />}
            {status === "OFF" && <span className="text-gray-400 text-xs">-</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header with Panduan */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Panduan</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-blue-600" />
                <span>Work From Home (WFH)</span>
              </div>
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-4 h-4 text-green-600" />
                <span>Work From Office (WFO)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">-</span>
                <span>Hari libur</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Klik ikon atau dropdown untuk mengubah jadwal karyawan atau klik tambah karyawan untuk menambahkan jadwal kerja ke karyawan
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari Nama Karyawan atau Jenis Industri"
            />
          </div>
          <div className="flex items-center gap-3">
            <FilterButton
              label="Pilih Status"
              options={[
                { label: "Kontrak", value: "Kontrak" },
                { label: "Karyawan Tetap", value: "Karyawan Tetap" },
                { label: "Magang", value: "Magang" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <button
              onClick={() => setIsTambahLokasiOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <BuildingOfficeIcon className="w-5 h-5" />
              Tambah Lokasi WFO
            </button>
            <button
              onClick={() => setIsGenerateJadwalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <CalendarIcon className="w-5 h-5" />
              Generate Jadwal
            </button>
          </div>
        </div>
      </div>

      {/* Custom Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Nama Karyawan
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Senin
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Selasa
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Rabu
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Kamis
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Jum'at
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Sabtu
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Minggu
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((karyawan) => (
                <tr
                  key={karyawan.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/karyawan/${karyawan.id}`)}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-medium text-gray-900 text-sm">{karyawan.id}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-medium text-gray-900 text-sm">{karyawan.nama}</div>
                      <div className="text-xs text-gray-500">{karyawan.jabatan}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Aktif
                    </span>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "senin")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "selasa")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "rabu")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "kamis")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "jumat")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "sabtu")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "minggu")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-center">
                    <button 
                      className="text-gray-400 hover:text-gray-600" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Popup Components */}
      <TambahLokasiWFOPopup
        isOpen={isTambahLokasiOpen} 
        onClose={() => setIsTambahLokasiOpen(false)} 
      />
      
      <GenerateJadwalPopup
        isOpen={isGenerateJadwalOpen} 
        onClose={() => setIsGenerateJadwalOpen(false)} 
      />
    </div>
  );
}