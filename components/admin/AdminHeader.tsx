'use client';

interface Admin {
  name: string;
  email: string;
  role: string;
}

export default function AdminHeader({ admin }: { admin?: Admin }) {
  return (
    <div className="admin-header mb-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Selamat datang, {admin?.name || 'Admin'}
        </h2>
        <p className="text-sm text-gray-600">{admin?.email}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
