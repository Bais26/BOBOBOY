import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export default function StatsCard({ icon, value, label, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    red: 'border-red-500',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-t-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-4">
        <div className="text-gray-400">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}
