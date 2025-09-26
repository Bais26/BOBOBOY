export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Berhasil!</h1>
        <p className="text-gray-600 mb-6">Selamat datang di dashboard Cybers Blitz Nusantara.</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Ini adalah halaman dashboard demo</p>
          <p>• Implementasikan fitur sesuai kebutuhan</p>
          <p>• Gunakan layout yang konsisten</p>
        </div>
      </div>
    </div>
  );
}