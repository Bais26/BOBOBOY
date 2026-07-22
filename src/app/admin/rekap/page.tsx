"use client";

import { useRouter } from "next/navigation";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Table from "@/components/shared/Table";
import SearchInput from "@/components/shared/SearchInput";
import FilterButton from "@/components/shared/FilterButton";
import ExportButton from "@/components/shared/ExportButton";
import Pagination from "@/components/shared/Pagination";
import { useRekapAdmin } from "@/hooks/Userekapadmin";
import * as XLSX from "xlsx";
import { RekapTableRow } from "@/types/rekap";

const MONTH_OPTIONS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
].map((label, i) => ({ label, value: String(i + 1) }));

const currentYear = new Date().getFullYear();

const YEAR_OPTIONS = Array.from(
  { length: 5 },
  (_, i) => currentYear - i
).map((y) => ({
  label: String(y),
  value: String(y),
}));

export default function ManagementRekapPage() {
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    setPage,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    year,
    setYear,
    month,
    setMonth,
    workStatus,
    setWorkStatus,
    refetch,
  } = useRekapAdmin();

  const handleExport = (format: "pdf" | "excel") => {
    if (format === "excel" && data?.karyawan) {
      const worksheet = XLSX.utils.json_to_sheet(
        data.karyawan.map((k, index) => ({
          No: (currentPage - 1) * 10 + index + 1,
          "Nama Karyawan": k.nama_lengkap,
          Hadir: k.total_hadir,
          Terlambat: k.total_terlambat,
          Alfa: k.total_alfa,
          "Total Jam Kerja": `${Math.floor(k.total_menit_kerja / 60)}j ${k.total_menit_kerja % 60}m`,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Karyawan");
      XLSX.writeFile(workbook, `rekap-karyawan-${year}-${month}.xlsx`);
    } else {
      alert(`Export to ${format.toUpperCase()} - Feature coming soon!`);
    }
  };

  const tableRows: RekapTableRow[] = (data?.karyawan ?? []).map((k, index) => ({
    id: (currentPage - 1) * 10 + index + 1,
    user_id: k.user_id,
    nama_lengkap: k.nama_lengkap,
    email: k.email,
    posisi: k.posisi ?? "-",
    divisi: k.divisi ?? "-",
    hadir: String(k.total_hadir), // Pastikan ini string
    terlambat: String(k.total_terlambat), // Pastikan ini string
    alfa: String(k.total_alfa),
    total_jam_kerja: `${Math.floor(k.total_menit_kerja / 60)}j ${
      k.total_menit_kerja % 60
    }m`,
  }));

  const columns = [
    { header: "ID", accessor: "id" as keyof RekapTableRow },
    {
      header: "NAMA KARYAWAN",
      accessor: "nama_lengkap" as keyof RekapTableRow,
    },
    { header: "HADIR", accessor: "hadir" as keyof RekapTableRow },
    { header: "TERLAMBAT", accessor: "terlambat" as keyof RekapTableRow },
    { header: "ALFA", accessor: "alfa" as keyof RekapTableRow },
    { header: "JAM KERJA", accessor: "total_jam_kerja" as keyof RekapTableRow },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {data?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Hadir", value: data.summary.total_hadir },
            { label: "Terlambat", value: data.summary.total_terlambat },
            { label: "Total Alfa", value: data.summary.total_alfa },
            { label: "Total WFO", value: data.summary.total_wfo },
            { label: "Total WFH", value: data.summary.total_wfh },
          ].map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-lg shadow-sm p-4 text-center"
            >
              <p className="text-xs text-gray-500 mb-1">{c.label}</p>
              <p className="text-xl font-semibold text-gray-800">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari Nama Karyawan..."
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Bulan */}
            <div className="flex items-center gap-2">
              <FilterButton
                label="Bulan"
                options={MONTH_OPTIONS}
                value={month ? [String(month)] : []}
                multiSelect={false}
                onChange={(vals) =>
                  setMonth(vals[0] ? Number(vals[0]) : undefined)
                }
              />
            </div>

            {/* Tahun */}
            <FilterButton
              label="Tahun"
              options={YEAR_OPTIONS}
              value={[String(year)]}
              multiSelect={false}
              onChange={(vals) => {
                if (vals[0]) setYear(Number(vals[0]));
              }}
            />

            {/* Refresh */}
            <button
              onClick={refetch}
              title="Refresh"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
            >
              <ArrowPathIcon
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            <ExportButton onExport={handleExport} />

          </div>
        </div>

        {/* Info periode */}
        {data?.summary && (
          <p className="mt-3 text-xs text-gray-400">
            Periode:{" "}
            <span className="font-medium text-gray-600">
              {data.summary.periode}
            </span>
            {" · "}Total karyawan:{" "}
            <span className="font-medium text-gray-600">
              {data.total_karyawan}
            </span>
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}{" "}
          <button
            onClick={refetch}
            className="underline hover:no-underline ml-1"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading && !data ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
            Memuat data...
          </div>
        ) : !isLoading && tableRows.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Tidak ada data ditemukan.
          </div>
        ) : (
          <div className={isLoading ? "opacity-60 pointer-events-none" : ""}>
            <Table
              columns={columns}
              data={tableRows}
              onRowClick={(row) =>
                router.push(`/admin/karyawan/${row.user_id}`)
              }
            />
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={data?.total_karyawan ?? 0}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
