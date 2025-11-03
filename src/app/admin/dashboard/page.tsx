import StatsCard from '@/components/admin/StatsCard';
import AttendanceChart from '@/components/admin/AttendanceChart';
import RecentActivity from '@/components/admin/RecentActivity';
import { UsersIcon, UserGroupIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={<UsersIcon className="w-8 h-8" />}
          value="150"
          label="Total Karyawan"
          color="blue"
        />
        <StatsCard 
          icon={<UserGroupIcon className="w-8 h-8" />}
          value="8"
          label="Tidak Hadir"
          color="red"
        />
        <StatsCard 
          icon={<ClockIcon className="w-8 h-8" />}
          value="142"
          label="Hadir"
          color="green"
        />
        <StatsCard 
          icon={<ExclamationCircleIcon className="w-8 h-8" />}
          value="13"
          label="Terlambat"
          color="yellow"
        />
      </div>

      <AttendanceChart />

      <RecentActivity />
    </div>
  );
}
