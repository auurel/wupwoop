'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function TestimonialsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
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

    fetchTestimonials(token);
  }, [router]);

  const fetchTestimonials = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/testimonials', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error('Failed to fetch testimonials');

      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTestimonials(testimonials.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Moderate Testimoni</h1>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : testimonials.length === 0 ? (
          <div className="admin-card">
            <p className="text-gray-600">Belum ada testimoni</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div key={item.id} className="admin-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.customerName}</p>
                  <p className="text-sm text-gray-600">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Rating: {item.rating} | {item.isApproved ? 'Disetujui' : 'Menunggu'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger text-xs">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
