import { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function InfoCard({ title, icon, children }: InfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-gray-600">{icon}</div>
        <h3 className="text-md font-medium text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}