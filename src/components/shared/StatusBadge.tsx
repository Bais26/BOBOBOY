interface StatusBadgeProps {
  status: string;
  variant?: 'kontrak' | 'tetap' | 'magang' | 'aktif' | 'nonaktif';
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'kontrak':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'tetap':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'magang':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'aktif':
        return 'bg-green-50 text-green-700';
      case 'nonaktif':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getVariantStyles()}`}>
      {(variant === 'aktif' || variant === 'nonaktif') && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === 'aktif' ? 'bg-green-500' : 'bg-gray-400'}`} />
      )}
      {status}
    </span>
  );
}