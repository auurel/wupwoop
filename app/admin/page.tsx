'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  totalServices: number;
  pendingTestimonials: number;
  newInquiries: number;
  approvedTestimonials: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            router.push('/admin/login');
            return;
          }

          throw new Error(data.error || 'Gagal memuat statistik dashboard');
        }

        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoadError(error instanceof Error ? error.message : 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="admin-grid mb-8">
              <div className="admin-stat">
                <div className="admin-stat-number">{stats.totalProducts}</div>
                <div className="admin-stat-label">Total Produk</div>
              </div>
              <div className="admin-stat">
                <div className="admin-stat-number">{stats.totalServices}</div>
                <div className="admin-stat-label">Total Layanan</div>
              </div>
              <div className="admin-stat">
                <div className="admin-stat-number">{stats.pendingTestimonials}</div>
                <div className="admin-stat-label">Testimoni Menunggu</div>
              </div>
              <div className="admin-stat">
                <div className="admin-stat-number">{stats.newInquiries}</div>
                <div className="admin-stat-label">Inquiries Baru</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  href="/admin/products"
                  className="admin-btn admin-btn-primary text-center"
                >
                  Kelola Produk
                </Link>
                <Link
                  href="/admin/services"
                  className="admin-btn admin-btn-primary text-center"
                >
                  Kelola Layanan
                </Link>
                <Link
                  href="/admin/testimonials"
                  className="admin-btn admin-btn-primary text-center"
                >
                  Review Testimoni
                </Link>
                <Link
                  href="/admin/settings"
                  className="admin-btn admin-btn-primary text-center"
                >
                  Pengaturan
                </Link>
                <Link
                  href="/admin/admins"
                  className="admin-btn admin-btn-primary text-center"
                >
                  Kelola Admin
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-red-600">{loadError || 'Gagal memuat data'}</div>
        )}
      </div>
    </div>
  );
}
