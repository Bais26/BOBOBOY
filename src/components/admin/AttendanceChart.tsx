'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Senin', hadir: 28, tidak_hadir: 0, terlambat: 2 },
  { name: 'Selasa', hadir: 35, tidak_hadir: 3, terlambat: 2 },
  { name: 'Rabu', hadir: 30, tidak_hadir: 4, terlambat: 3 },
  { name: 'Kamis', hadir: 32, tidak_hadir: 3, terlambat: 3 },
  { name: 'Jumat', hadir: 25, tidak_hadir: 5, terlambat: 4 },
];

export default function AttendanceChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Trend Kehadiran Mingguan (7 Hari Terakhir)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="hadir" fill="#10b981" radius={[4, 4, 0, 0]} name="Hadir" />
          <Bar dataKey="tidak_hadir" fill="#ef4444" radius={[4, 4, 0, 0]} name="Tidak hadir" />
          <Bar dataKey="terlambat" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Terlambat" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}