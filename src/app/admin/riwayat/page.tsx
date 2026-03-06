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
import { Rekap } from "@/types/rekap";
import { Riwayat } from "@/types/riyawat";

const names = ["Bais Yufan", "Muhit Ramadhan", "Yasir", "Zulfan"];
const lokasi = "Jl. Asia Afrika No. 123, Bandung";
const statusList = ["HADIR", "TERLAMBAT", "IZIN", "ALFA"] as const;

const mockData: Riwayat[] = Array.from({ length: 100 }, (_, i) => {
  return {
    id: `CBN${300 + i}`,
    tanggal: "24/10/2024",
    nama: names[i % names.length],
    masuk: "08:05",
    pulang: "17:00",
    mode: i % 10 > 7 ? "WFH" : "WFO",
    lokasi,
    status: statusList[i % 4],
  };
});

export default function ManagementRekapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = mockData.filter((karyawan) => {
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

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting as ${format}`);
    alert(`Export to ${format.toUpperCase()} - Feature coming soon!`);
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof Riwayat },
    { header: "NAMA KARYAWAN", accessor: "nama" as keyof Riwayat },
    { header: "JAM MASUK", accessor: "masuk" as keyof Riwayat },
    { header: "JAM PULANG", accessor: "pulang" as keyof Riwayat },

    // MODE KERJA
    {
      header: "MODE KERJA",
      accessor: (row: Riwayat) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              row.mode === "WFO" ? "bg-blue-500" : "bg-green-500"
            }`}
          />
          <span className="text-gray-700">{row.mode}</span>
        </div>
      ),
    },

    { header: "LOKASI ABSEN", accessor: "lokasi" as keyof Riwayat },

    // STATUS BADGE
    {
      header: "STATUS",
      accessor: (row: Riwayat) => {
        const badgeStyles: Record<Riwayat["status"], string> = {
          HADIR: "bg-green-100 text-green-700",
          TERLAMBAT: "bg-yellow-100 text-yellow-700",
          ALFA: "bg-red-100 text-red-700",
          IZIN: "bg-blue-100 text-blue-700",
        };
        return (
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              badgeStyles[row.status]
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
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
            <ExportButton onExport={handleExport} />
            {/* <button
              onClick={() => router.push("/admin/karyawan/create")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Karyawan
            </button> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={paginatedData}
          onRowClick={(row) => router.push(`/admin/karyawan/${row.id}`)}
        />
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
