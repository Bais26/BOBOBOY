'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';
import FilterButton from '@/components/shared/FilterButton';

const TREND_FILTER_OPTIONS = [
  { label: 'Per Minggu Ini', value: 'week' },
  { label: 'Per Bulan Ini', value: 'month' },
  { label: 'Per Tahun Ini', value: 'year' },
];

function SummaryCard({ label, value, isLoading }: { label: string; value: string | number; isLoading: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 text-center flex flex-col justify-center">
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
  const { data, isLoading, error, trendFilter, setTrendFilter, refetch } = useDashboard();

  const summaryData = data?.summary;

  return (
    <div className="space-y-6">
      {/* Bagian Ringkasan (Summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Hadir Hari Ini"
          value={summaryData?.total_hadir ?? 0}
          isLoading={isLoading}
        />
        <SummaryCard
          label="Total Terlambat Hari Ini"
          value={summaryData?.total_terlambat ?? 0}
          isLoading={isLoading}
        />
        <SummaryCard
          label="Total Alfa Hari Ini"
          value={summaryData?.total_alfa ?? 0}
          isLoading={isLoading}
        />
      </div>

      {/* Bagian Grafik Tren Kehadiran */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Tren Kehadiran</h2>
          <div className="flex items-center gap-3">
            <FilterButton
              label="Filter Tren"
              options={TREND_FILTER_OPTIONS}
              value={[trendFilter]}
              onChange={(vals) => setTrendFilter(vals[0] as typeof trendFilter)}
            />
            <button
              onClick={refetch}
              title="Refresh Data"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center py-10 text-red-600">
            <p>{error}</p>
            <button onClick={refetch} className="mt-2 text-blue-600 hover:underline">
              Coba lagi
            </button>
          </div>
        )}

        {isLoading && !data && (
          <div className="flex items-center justify-center h-72 text-gray-500">
            <ArrowPathIcon className="w-6 h-6 animate-spin mr-3" />
            Memuat data grafik...
          </div>
        )}

        {data && !isLoading && (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data.trend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                  contentStyle={{
                    borderRadius: '0.5rem',
                    borderColor: '#e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="Hadir" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Terlambat" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Alfa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}