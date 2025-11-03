interface InfoRowProps {
  label: string;
  value: string;
  columns?: 2 | 3;
}

export default function InfoRow({ label, value, columns = 2 }: InfoRowProps) {
  const columnClass = columns === 3 ? 'md:col-span-1' : 'md:col-span-1';
  
  return (
    <div className={columnClass}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
