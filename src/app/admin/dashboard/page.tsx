"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboard } from "@/hooks/useDashboard";
import FilterButton from "@/components/shared/FilterButton";

const TREND_FILTER_OPTIONS = [
  {
    label: "Per Minggu Ini",
    value: "week",
  },
  {
    label: "Per Bulan Ini",
    value: "month",
  },
  {
    label: "Per Tahun Ini",
    value: "year",
  },
];

function SummaryCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string | number;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>

      {isLoading ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse mx-auto rounded-md" />
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error, trendFilter, setTrendFilter, refetch } =
    useDashboard();

  const summaryData = data?.summary;

  return (
    <div className="space-y-6">
      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <SummaryCard
          label="Total Hadir Hari Ini"
          value={summaryData?.total_hadir ?? 0}
          isLoading={isLoading}
        />

        <SummaryCard
          label="Total Terlambat"
          value={summaryData?.total_terlambat ?? 0}
          isLoading={isLoading}
        />

        <SummaryCard
          label="Total Alfa"
          value={summaryData?.total_alfa ?? 0}
          isLoading={isLoading}
        />

        <SummaryCard
          label="Total WFO"
          value={summaryData?.total_wfo ?? 0}
          isLoading={isLoading}
        />

        <SummaryCard
          label="Total WFH"
          value={summaryData?.total_wfh ?? 0}
          isLoading={isLoading}
        />
      </div>

      {/* ================= FILTER ================= */}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Dashboard Absensi
          </h2>

          <div className="flex gap-3">
            <FilterButton
              label="Filter"
              options={TREND_FILTER_OPTIONS}
              value={[trendFilter]}
              multiSelect={false}
              onChange={(value) => {
                setTrendFilter(value[0] as typeof trendFilter);
              }}
            />

            <button
              onClick={refetch}
              className="p-2 rounded-lg border hover:bg-gray-50"
            >
              <ArrowPathIcon
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-center text-red-600">{error}</div>}

      {/* ================= GRAPH ================= */}

      {data && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ================= KEHADIRAN ================= */}

          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-5">
              Tren Kehadiran
            </h2>

            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="Hadir" fill="#3b82f6" radius={[4, 4, 0, 0]} />

                  <Bar
                    dataKey="Terlambat"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar dataKey="Alfa" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================= WFO WFH ================= */}

          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-5">
              Tren WFO dan WFH
            </h2>

            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={data.workLocationTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="WFO" fill="#8b5cf6" radius={[4, 4, 0, 0]} />

                  <Bar dataKey="WFH" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
