'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function SettingsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pengaturan Site</h1>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : settings ? (
          <div className="admin-card space-y-4">
            <div>
              <label className="admin-form-label">Nomor WhatsApp</label>
              <p className="text-sm text-gray-600">{settings.whatsappNumber}</p>
            </div>
            <div>
              <label className="admin-form-label">Alamat</label>
              <p className="text-sm text-gray-600">{settings.address}</p>
            </div>
            <div>
              <label className="admin-form-label">Instagram</label>
              <p className="text-sm text-gray-600">@{settings.instagramUsername}</p>
            </div>
            <div>
              <label className="admin-form-label">TikTok</label>
              <p className="text-sm text-gray-600">@{settings.tiktokUsername}</p>
            </div>
            <p className="text-gray-600 mt-6">Fitur edit pengaturan akan segera tersedia</p>
          </div>
        ) : (
          <div className="admin-card">
            <p className="text-red-600">Gagal memuat pengaturan</p>
          </div>
        )}
      </div>
    </div>
  );
}
