import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader />
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-400">Chào mừng đến với Admin Panel</p>
      </div>
    </>
  );
}
