'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function HoursPage() {
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
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#3D2817' }}>
            Jam Operasional
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Kelola jadwal jam operasional Muzayyan
          </p>
        </div>
        <div className="admin-card">
          <p style={{ color: '#6b7280', margin: '0' }}>Fitur edit jam operasional akan segera tersedia</p>
        </div>
      </div>
    </div>
  );
}
