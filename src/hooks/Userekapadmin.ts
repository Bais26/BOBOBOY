import { useState, useEffect, useCallback, useRef } from "react";
import { fetchRekapAdmin } from "@/lib/rekapService";
import {
  RekapAdminResponse,
  RekapQueryParams,
  FilterType,
  WorkStatus,
} from "@/types/rekap";

const ITEMS_PER_PAGE = 10;

interface UseRekapAdminReturn {
  data: RekapAdminResponse | null;
  isLoading: boolean;
  error: string | null;
  // Pagination
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  // Filter & search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: FilterType;
  setFilterType: (f: FilterType) => void;
  year: number;
  setYear: (y: number) => void;
  month: number | undefined;
  setMonth: (m: number | undefined) => void;
  workStatus: WorkStatus | undefined;
  setWorkStatus: (s: WorkStatus | undefined) => void;
  // Refetch manually
  refetch: () => void;
}

export function useRekapAdmin(): UseRekapAdminReturn {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [data, setData] = useState<RekapAdminResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination (server-side)
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("month");
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState<number | undefined>(currentMonth);
  const [workStatus, setWorkStatus] = useState<WorkStatus | undefined>(undefined);

  // Debounce ref for search
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(q);
      setCurrentPage(1); // reset ke halaman 1 saat search berubah
    }, 400);
  }, []);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const handleFilterTypeChange = useCallback(
    (f: FilterType) => { setFilterType(f); resetPage(); },
    [resetPage]
  );
  const handleYearChange = useCallback(
    (y: number) => { setYear(y); resetPage(); },
    [resetPage]
  );
  const handleMonthChange = useCallback(
    (m: number | undefined) => { setMonth(m); resetPage(); },
    [resetPage]
  );
  const handleWorkStatusChange = useCallback(
    (s: WorkStatus | undefined) => { setWorkStatus(s); resetPage(); },
    [resetPage]
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: RekapQueryParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        year,
        ...(month && { filter: "month", month }),
        ...(debouncedSearch ? { nama_lengkap: debouncedSearch } : {}),
        ...(workStatus ? { work_status: workStatus } : {}),
      };
      const result = await fetchRekapAdmin(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, year, month, debouncedSearch, workStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = data
    ? Math.ceil(data.total_karyawan / ITEMS_PER_PAGE)
    : 1;

  return {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    setPage: setCurrentPage,
    searchQuery,
    setSearchQuery: handleSearchChange,
    filterType,
    setFilterType: handleFilterTypeChange,
    year,
    setYear: handleYearChange,
    month,
    setMonth: handleMonthChange,
    workStatus,
    setWorkStatus: handleWorkStatusChange,
    refetch: load,
  };
}