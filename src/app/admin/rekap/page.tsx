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

// Mock data dengan angka (acak)
const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const mockData: Rekap[] = Array.from({ length: 100 }, (_, i) => {
  const hadir = getRandom(20, 28);        // hadir antara 20–28 hari
  const izin = getRandom(0, 2);           // izin 0–2
  const terlambat = getRandom(0, 5);      // terlambat 0–5
  const alfa = getRandom(0, 2);           // alfa 0–2
  const total = hadir + izin + terlambat + alfa;

  return {
    id: `CBN${234 + i}`,
    nama: ["Bais Yufan", "muhit Ramadhan", "yasir", "zulfan"][i % 4],
    hadir: hadir.toString(),
    terlambat: terlambat.toString(),
    izin: izin.toString(),
    alfa: alfa.toString(),
    total: total.toString(),
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
    { header: "ID", accessor: "id" as keyof Rekap },
    { header: "NAMA KARYAWAN", accessor: "nama" as keyof Rekap },
    { header: "HADIR", accessor: "hadir" as keyof Rekap },
    { header: "TERLAMBAT", accessor: "terlambat" as keyof Rekap },
    { header: "IZIN", accessor: "izin" as keyof Rekap },
    { header: "ALFA", accessor: "alfa" as keyof Rekap },
    { header: "TOTAL HARI KERJA", accessor: "total" as keyof Rekap },
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
            <button 
              onClick={() => router.push('/admin/karyawan/create')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Karyawan
            </button>
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
