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

// Mock data
const mockData: Karyawan[] = Array.from({ length: 100 }, (_, i) => ({
  id: `CBN${234 + i}`,
  nama: "Bais Yufan",
  email: "Baisyufan@gmail.com",
  departemen: ["IT", "FINANCE", "MARKETING", "UI/UX"][i % 4],
  statusKaryawan: (["Kontrak", "Karyawan Tetap", "Magang"] as StatusKaryawan[])[
    i % 3
  ],
  status: (i % 5 === 0 ? "Nonaktif" : "Aktif") as StatusAktif,
}));

export default function ManagementKaryawanPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [departemenFilter, setDepartemenFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data
  const filteredData = mockData.filter((karyawan) => {
    const matchesSearch =
      karyawan.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      karyawan.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      karyawan.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(karyawan.statusKaryawan);
    const matchesDepartemen =
      departemenFilter.length === 0 ||
      departemenFilter.includes(karyawan.departemen);

    return matchesSearch && matchesStatus && matchesDepartemen;
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
    { header: "ID", accessor: "id" as keyof Karyawan },
    { header: "NAMA KARYAWAN", accessor: "nama" as keyof Karyawan },
    { header: "EMAIL", accessor: "email" as keyof Karyawan },
    { header: "DEPARTEMEN", accessor: "departemen" as keyof Karyawan },
    {
      header: "STATUS KARYAWAN",
      accessor: ((row: Karyawan) => (
        <StatusBadge
          status={row.statusKaryawan}
          variant={getStatusVariant(row.statusKaryawan)}
        />
      )) as any,
    },
    {
      header: "STATUS",
      accessor: ((row: Karyawan) => (
        <StatusBadge
          status={row.status}
          variant={row.status === "Aktif" ? "aktif" : "nonaktif"}
        />
      )) as any,
    },
    {
      header: "AKSI",
      accessor: ((row: Karyawan) => (
        <ActionMenu
          items={[
            {
              label: "Lihat Detail",
              onClick: () => router.push(`/admin/karyawan/${row.id}`),
            },
            { 
              label: "Edit", 
              onClick: () => router.push(`/admin/karyawan/${row.id}/edit`) 
            },
            {
              label: "Hapus",
              onClick: () => handleDelete(row.id),
              danger: true,
            },
          ]}
        />
      )) as any,
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
