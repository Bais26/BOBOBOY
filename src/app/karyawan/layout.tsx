import KaryawanSidebar from '@/components/karyawan/KaryawanSidebar';
import Header from '@/components/shared/Header';

export default function KaryawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <KaryawanSidebar />
      <div className="flex-1 flex flex-col">
        <Header role="karyawan" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}