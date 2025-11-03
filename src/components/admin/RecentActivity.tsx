interface ActivityItem {
  name: string;
  action: string;
  status: 'hadir' | 'terlambat' | 'izin';
}

const activities: ActivityItem[] = [
  { name: 'Bais Yufan', action: 'Absen tepat waktu', status: 'hadir' },
  { name: 'Bais Yufan', action: 'Absen tepat waktu', status: 'terlambat' },
  { name: 'Bais Yufan', action: 'Absen tepat waktu', status: 'izin' },
  { name: 'Bais Yufan', action: 'Absen tepat waktu', status: 'hadir' },
];

const statusStyles = {
  hadir: 'bg-green-100 text-green-700',
  terlambat: 'bg-red-100 text-red-700',
  izin: 'bg-yellow-100 text-yellow-700',
};

const statusLabels = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  izin: 'Izin',
};

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                {activity.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-800">{activity.name}</div>
                <div className="text-sm text-gray-500">{activity.action}</div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[activity.status]}`}>
              {statusLabels[activity.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
