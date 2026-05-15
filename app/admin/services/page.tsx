'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

    fetchServices();
  }, [router]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />
        
        <div className="mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#3D2817' }}>
            Kelola Layanan
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Manajemen layanan jahit dan jasa Muzayyan
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-2">Memuat data...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="admin-card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Daftar Layanan Tersedia</h2>
              <p className="text-sm text-gray-600">Total {services.length} layanan yang ditawarkan</p>
            </div>

            <div className="space-y-3">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="flex items-start gap-4 p-4 bg-white border-l-4 border-orange-400 rounded hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">#{service.order}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {service.isActive ? '✓ Aktif' : '✗ Tidak Aktif'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-card bg-orange-50 border-l-4 border-orange-400">
            <p className="text-gray-700 font-medium">📋 Tidak ada layanan tersedia</p>
            <p className="text-sm text-gray-600 mt-2">Silakan tambahkan layanan baru untuk memulai</p>
          </div>
        )}
      </div>
    </div>
  );
}
