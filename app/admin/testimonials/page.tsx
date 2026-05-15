'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function TestimonialsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, [router]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Moderate Testimoni</h1>
        <div className="admin-card">
          <p className="text-gray-600">Fitur moderasi testimoni akan segera tersedia</p>
        </div>
      </div>
    </div>
  );
}
