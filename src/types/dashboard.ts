export type TrendFilter = "week" | "month" | "year";

export interface TodaySummary {
  total_karyawan_aktif: number;

  total_hadir: number;

  total_terlambat: number;

  total_alfa: number;

  total_wfo: number;

  total_wfh: number;
}

export interface TrendDataPoint {
  label: string;

  hadir: number;

  terlambat: number;

  alfa: number;
}

export interface WorkModeTrendPoint {
  label: string;

  wfo: number;

  wfh: number;
}

export interface DashboardData {
  today_summary: TodaySummary;

  attendance_trend: TrendDataPoint[];

  work_mode_trend: WorkModeTrendPoint[];
}
