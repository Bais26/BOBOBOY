"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import Table from "@/components/shared/Table";
import SearchInput from "@/components/shared/SearchInput";
import StatusBadge from "@/components/shared/StatusBadge";
import FilterButton from "@/components/shared/FilterButton";
import ExportButton from "@/components/shared/ExportButton";
import Pagination from "@/components/shared/Pagination";
import ActionMenu from "@/components/shared/ActionMenu";
import { Karyawan, StatusKaryawan, StatusAktif } from "@/types/karyawan";
import { Absensi } from "@/types/riyawat";

const mockAbsensi: Absensi[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ABS-${i}`,
  tanggal: "24/10/2024",
  jamMasuk: "08:05",
  jamPulang: "17:00",
  jamKerja: "8j 50m",
  modeKerja: "WFH",
  lokasi: "Jl. Asia Afrika No. 123, Bandung",
  status: "Hadir",
}));

export default function ManagementKaryawanPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [departemenFilter, setDepartemenFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tanggalFilter, setTanggalFilter] = useState("");
  const [modeKerjaFilter, setModeKerjaFilter] = useState<string[]>([]);

  const filteredData = mockAbsensi.filter((riwayat) => {
    const matchesTanggal = !tanggalFilter || riwayat.tanggal === tanggalFilter;
    const matchesModeKerja =
      modeKerjaFilter.length === 0 ||
      modeKerjaFilter.includes(riwayat.modeKerja);

    return matchesTanggal && matchesModeKerja;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting as ${format}`);
    alert(`Export to ${format.toUpperCase()} - Feature coming soon!`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      // TODO: Implement delete API call
      console.log("Delete karyawan:", id);
      alert("Karyawan berhasil dihapus!");
    }
  };

  const getStatusVariant = (
    status: StatusKaryawan
  ): "kontrak" | "tetap" | "magang" => {
    if (status === "Kontrak") return "kontrak";
    if (status === "Karyawan Tetap") return "tetap";
    return "magang";
  };

  const columns = [
    { header: "TANGGAL", accessor: "tanggal" },
    { header: "JAM MASUK", accessor: "jamMasuk" },
    { header: "JAM PULANG", accessor: "jamPulang" },
    { header: "JAM KERJA", accessor: "jamKerja" },
    {
      header: "MODE KERJA",
      accessor: ((row: Absensi) => (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm">{row.modeKerja}</span>
        </div>
      )) as any,
    },
    {
      header: "LOKASI ABSEN",
      accessor: ((row: Absensi) => (
        <span className="text-sm text-gray-600">{row.lokasi}</span>
      )) as any,
    },
    {
      header: "STATUS",
      accessor: ((row: Absensi) => (
        <StatusBadge status={row.status} variant="aktif" />
      )) as any,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Data Rekap Absensi
        </h1>

        <div className="flex gap-2">
          <input
            type="date"
            value={tanggalFilter}
            onChange={(e) => setTanggalFilter(e.target.value)}
            className="border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 px-3 py-2"
          />
          <FilterButton
            label="Mode Kerja"
            options={[
              { label: "WFH", value: "WFH" },
              { label: "WFO", value: "WFO" },
            ]}
            value={modeKerjaFilter}
            onChange={setModeKerjaFilter}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table columns={columns} data={paginatedData} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
