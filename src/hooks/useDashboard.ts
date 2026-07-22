"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  DashboardData as ApiDashboardData,
  TrendFilter,
  TodaySummary,
  TrendDataPoint,
} from "@/types/dashboard";

interface ProcessedTrendDataPoint {
  name: string;
  Hadir: number;
  Terlambat: number;
  Alfa: number;
}

interface ProcessedWorkLocationTrendDataPoint {
  name: string;
  WFO: number;
  WFH: number;
}

interface ProcessedSummaryData extends TodaySummary {
  attendance_rate: number;
}

export interface ProcessedDashboardData {
  summary: ProcessedSummaryData;
  trend: ProcessedTrendDataPoint[];
  workLocationTrend: ProcessedWorkLocationTrendDataPoint[];
}

async function fetchDashboardData(
  filter: TrendFilter,
): Promise<ApiDashboardData> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/dashboard/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      params: {
        // untuk attendance trend
        filter: filter,

        // untuk WFO WFH
        mode_filter: filter,
      },
    },
  );

  return response.data;
}

export function useDashboard() {
  const [data, setData] = useState<ProcessedDashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [trendFilter, setTrendFilter] = useState<TrendFilter>("week");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiData = await fetchDashboardData(trendFilter);

      /*
       ==========================
       SUMMARY
       ==========================
      */

      const { total_hadir, total_karyawan_aktif } = apiData.today_summary;

      const attendance_rate =
        total_karyawan_aktif > 0
          ? (total_hadir / total_karyawan_aktif) * 100
          : 0;

      const processedSummary: ProcessedSummaryData = {
        ...apiData.today_summary,

        attendance_rate,
      };

      /*
       ==========================
       ATTENDANCE TREND
       Hadir
       Terlambat
       Alfa
       ==========================
      */

      const processedTrend: ProcessedTrendDataPoint[] =
        apiData.attendance_trend.map((point) => ({
          name: point.label,

          Hadir: point.hadir,

          Terlambat: point.terlambat,

          Alfa: point.alfa,
        }));

      /*
       ==========================
       WORK MODE TREND
       WFO
       WFH
       dari WorkSchedule
       ==========================
      */
 
      const processedWorkLocationTrend: ProcessedWorkLocationTrendDataPoint[] =
        apiData.work_mode_trend.map((point) => ({
          name: point.label,
          WFO: point.wfo,
          WFH: point.wfh,
        }));

      setData({
        summary: processedSummary,

        trend: processedTrend,

        workLocationTrend: processedWorkLocationTrend,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data dashboard";

      setError(errorMessage);

      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [trendFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,

    isLoading,

    error,

    trendFilter,

    setTrendFilter,

    refetch: loadData,
  };
}
