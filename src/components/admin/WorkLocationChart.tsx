'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WorkLocationChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Tren Lokasi Kerja (WFO/WFH)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="WFO" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="WFO" />
          <Bar dataKey="WFH" fill="#10b981" radius={[4, 4, 0, 0]} name="WFH" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}