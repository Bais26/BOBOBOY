"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Table from "@/components/shared/Table";
import SearchInput from "@/components/shared/SearchInput";
import StatusBadge from "@/components/shared/StatusBadge";
import FilterButton from "@/components/shared/FilterButton";
import ExportButton from "@/components/shared/ExportButton";
import Pagination from "@/components/shared/Pagination";
import ActionMenu from "@/components/shared/ActionMenu";
import { Karyawan, StatusKaryawan, StatusAktif } from "@/types/karyawan";
import Swal from "sweetalert2";

export default function ManagementKaryawanPage() {
  const router = useRouter();
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departemenFilter, setDepartemenFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchData = async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/karyawan/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page, // <-- ini yang bikin request jadi ?page=2, ?page=3 dst
            limit: itemsPerPage,
          },
        },
      );

      const responseData = res.data;
      const karyawanArray = responseData.data || [];
      setKaryawanList(karyawanArray);

      setTotalPages(responseData.pagination?.total_pages || 1);
      setTotalItems(responseData.pagination?.total || 0);
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message || "Gagal mengambil data karyawan",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Filter data
  const filteredData = karyawanList.filter((karyawan) => {
    // Gunakan properti dari API response yang baru
    const nama = karyawan.full_name || "";
    const email = karyawan.email || "";
    const id = karyawan.id || "";

    const matchesSearch =
      nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(id).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartemen =
      departemenFilter.length === 0 ||
      departemenFilter.includes(karyawan.karyawan_detail?.division?.name ?? "");

    return matchesSearch && matchesDepartemen;
  });


  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting as ${format}`);
    Swal.fire(`Export to ${format.toUpperCase()} - Feature coming soon!`);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Karyawan akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/karyawan/${id}/detail`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Karyawan berhasil dihapus",
      });

      fetchData(); // refresh data
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message || "Terjadi kesalahan",
      });
    }
  };

  const getStatusVariant = (
    status: StatusKaryawan,
  ): "kontrak" | "tetap" | "magang" => {
    if (status === "Kontrak") return "kontrak";
    if (status === "Karyawan Tetap") return "tetap";
    return "magang";
  };

  const columns = [
    // { header: "ID", accessor: "id" as keyof Karyawan },
    { header: "NAMA KARYAWAN", accessor: "full_name" as keyof Karyawan },
    { header: "EMAIL", accessor: "email" as keyof Karyawan },
    {
      header: "DIVISI",
      accessor: (row: Karyawan) => row.karyawan_detail?.subdivision?.division?.name ?? "-",
    },
    {
      header: "SUBDIVISI",
      accessor: (row: Karyawan) => row.karyawan_detail?.subdivision?.name ?? "-",
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
              onClick: () => router.push(`/admin/karyawan/${row.id}/edit`),
            },
          ]}
        />
      )) as any,
    },
  ];

  // Opsi statis untuk filter divisi
  const departemenOptions = [
    { label: "Finance", value: "Finance" },
    { label: "IT", value: "IT" },
    { label: "HRD", value: "HRD" },
    { label: "Product Development", value: "Product Development" },
    { label: "Business Development", value: "Business Development" },
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
              placeholder="Cari Nama Karyawan atau Email"
            />
          </div>
          <div className="flex items-center gap-3">
            <FilterButton
              label="Pilih Divisi"
              options={departemenOptions}
              value={departemenFilter}
              onChange={setDepartemenFilter}
            />
            <ExportButton onExport={handleExport} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading karyawan...</div>
        ) : (
          <>
            <Table
              columns={columns}
              data={filteredData}
              onRowClick={(row) => router.push(`/admin/karyawan/${row.id}`)}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
