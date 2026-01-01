import ScheduleInfo from "@/components/karyawan/ScheduleInfo";
import CalendarSection from "@/components/karyawan/CalendarSection";

export default function JadwalPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <ScheduleInfo />
      <CalendarSection />
    </div>
  );
}
