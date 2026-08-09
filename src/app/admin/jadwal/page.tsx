"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  BuildingOfficeIcon,
  HomeIcon,
  XMarkIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import SearchInput from "@/components/shared/SearchInput";
import FilterButton from "@/components/shared/FilterButton";
import Pagination from "@/components/shared/Pagination";
import TambahLokasiWFOPopup from "@/components/admin/TambahLokasiWFOPopup";
import GenerateJadwalPopup from "@/components/admin/GenerateJadwalPopup";
import ScheduleEditModal from "@/components/admin/ScheduleEditModal";
import api from "@/lib/api"; // Import axios instance

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

function SimpleModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
}: SimpleModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
  employeeCode: string; // This is the short ID like CBN004
  user_id: string; // The UUID for the user/employee
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

interface OfficeLocation {
  id: string;
  name: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  start_date: string;
  end_date: string;
  total_karyawan: number;
  jabatan_filter: string | null;
  data: RekapWithSchedule[];
}

export default function ManagementRekapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<RekapWithSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalKaryawan, setTotalKaryawan] = useState(0);
  const [isTambahLokasiOpen, setIsTambahLokasiOpen] = useState(false);
  const [isGenerateJadwalOpen, setIsGenerateJadwalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<RekapWithSchedule | null>(null);
  const itemsPerPage = 10;
  const [editingLocation, setEditingLocation] = useState<OfficeLocation | null>(
    null,
  );

  // Fetch data from API
  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using axios instance from lib/api.ts
      const response = await api.get<ApiResponse>("/v1/schedule/all");

      setData(response.data.data);
      setStartDate(response.data.start_date);
      setEndDate(response.data.end_date);
      setTotalKaryawan(response.data.total_karyawan);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch data";
      setError(errorMessage);
      console.error("Error fetching schedule data:", err);

      // Jika unauthorized, redirect ke login
      if (err.response?.status === 401) {
        // router.push('/login'); // Uncomment jika ingin redirect
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((karyawan) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      String(karyawan.nama ?? "")
        .toLowerCase()
        .includes(q) ||
      String(karyawan.employeeCode ?? "")
        .toLowerCase()
        .includes(q) ||
      String(karyawan.jabatan ?? "")
        .toLowerCase()
        .includes(q);

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(karyawan.status);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleOpenEditModal = (karyawan: RekapWithSchedule) => {
    setEditingEmployee(karyawan);
  };

  const handleCloseEditModal = () => {
    setEditingEmployee(null);
    // Refresh data jika ada perubahan dari modal
    fetchScheduleData();
  };

  // Render schedule cell (hanya tampilan)
  const renderScheduleCell = (
    karyawan: RekapWithSchedule,
    day: keyof RekapWithSchedule["schedule"],
  ) => {
    const status = karyawan.schedule[day];
    const baseClasses =
      "flex items-center justify-center gap-1.5 rounded px-2 py-1 text-xs font-medium min-w-[70px]";
    const statusClasses = {
      WFH: "bg-blue-50 text-blue-700",
      WFO: "bg-green-50 text-green-700",
      OFF: "bg-gray-50 text-gray-500",
    };

    return (
      <div className={`${baseClasses} ${statusClasses[status]}`}>
        {status === "WFH" && <HomeIcon className="w-3.5 h-3.5" />}
        {status === "WFO" && <BuildingOfficeIcon className="w-3.5 h-3.5" />}
        <span>{status}</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data jadwal...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            {error.includes("Unauthorized") && (
              <p className="text-xs text-red-600 mt-2">
                Silakan login kembali untuk mengakses halaman ini.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={fetchScheduleData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Coba Lagi
          </button>
          {error.includes("Unauthorized") && (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Ke Halaman Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header with Date Range Info */}
      {startDate && endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Periode Jadwal
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  {new Date(startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(endDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900">
                Total Karyawan
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalKaryawan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Panduan */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
              Klik ikon atau dropdown untuk mengubah jadwal karyawan atau klik
              tambah karyawan untuk menambahkan jadwal kerja ke karyawan
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
              placeholder="Cari Nama Karyawan, ID, atau Jabatan"
            />
          </div>
          <div className="flex items-center gap-3">
            <FilterButton
              label="Pilih Status"
              options={[
                { label: "Aktif", value: "Aktif" },
                { label: "Nonaktif", value: "Nonaktif" },
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
        {paginatedData.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 font-medium">Tidak ada data karyawan</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Belum ada jadwal yang tersedia"}
            </p>
          </div>
        ) : (
          <>
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
                      Status
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
                      key={karyawan.user_id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleOpenEditModal(karyawan)}
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="font-medium text-gray-900 text-sm">
                          {karyawan.employeeCode}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <div className="font-medium text-gray-900 text-sm">
                            {karyawan.nama}
                          </div>
                          <div className="text-xs text-gray-500">
                            {karyawan.jabatan}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            karyawan.status === "Aktif"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              karyawan.status === "Aktif"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          ></span>
                          {karyawan.status}
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
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button
                              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EllipsisVerticalIcon className="h-5 w-5" />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              <div className="px-1 py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModal(karyawan);
                                      }}
                                      className={`${active ? "bg-blue-500 text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                      <PencilSquareIcon className="mr-2 h-5 w-5" />
                                      Edit Jadwal
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
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
          </>
        )}
      </div>

      {/* Popup Components */}
      <TambahLokasiWFOPopup
        isOpen={isTambahLokasiOpen}
        onClose={() => setIsTambahLokasiOpen(false)}
      />

      <ScheduleEditModal
        isOpen={!!editingEmployee}
        onClose={handleCloseEditModal}
        employee={
          editingEmployee
            ? {
                employeeCode: editingEmployee.employeeCode,
                userId: editingEmployee.user_id,
                name: editingEmployee.nama,
              }
            : null
        }
      />

      <GenerateJadwalPopup
        isOpen={isGenerateJadwalOpen}
        onClose={() => {
          setIsGenerateJadwalOpen(false);
          // Refresh data after generating schedule
          fetchScheduleData();
        }}
      />
    </div>
  );
}
