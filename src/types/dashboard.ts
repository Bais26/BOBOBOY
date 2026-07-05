export interface TrendDataPoint {
  label: string; // Contoh: "Senin", "Selasa"
  hadir: number;
  terlambat: number;
  alfa: number;
}

export interface TodaySummary {
  total_karyawan_aktif: number;
  total_hadir: number;
  total_terlambat: number;
  total_alfa: number;
}

export interface DashboardData {
  today_summary: TodaySummary;
  attendance_trend: TrendDataPoint[];
}

export type TrendFilter = 'week' | 'month' | 'year';