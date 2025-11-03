import AdminSidebar from '@/components/admin/AdminSidebar';
import Header from '@/components/shared/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Header role="admin" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
