'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

type Testimonial = {
  id: string;
  customerName: string;
  customerInitial?: string | null;
  avatarUrl?: string | null;
  rating: number;
  message: string;
  isApproved: boolean;
  isFeatured: boolean;
  submittedAt?: string;
  approvedAt?: string | null;
};

export default function TestimonialsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleApprovalToggle = async (id: string, isApproved: boolean) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved }),
      });

      if (!res.ok) throw new Error('Failed to update testimonial');

      const updated = await res.json();
      setTestimonials((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (error) {
      console.error('Error updating testimonial:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Moderate Testimoni</h1>
          <button
            onClick={() => fetchTestimonials()}
            className="admin-btn admin-btn-secondary text-xs"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : testimonials.length === 0 ? (
          <div className="admin-card">
            <p className="text-gray-600">Belum ada testimoni</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div key={item.id} className="admin-card flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.customerName}</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Rating: {item.rating} | {item.isApproved ? 'Disetujui' : 'Menunggu approval'}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end md:w-auto md:flex-nowrap">
                  <button
                    onClick={() => handleApprovalToggle(item.id, !item.isApproved)}
                    disabled={updatingId === item.id}
                    className={
                      item.isApproved
                        ? 'admin-btn admin-btn-secondary text-xs w-full sm:w-auto whitespace-nowrap justify-center px-4'
                        : 'admin-btn admin-btn-primary text-xs w-full sm:w-auto whitespace-nowrap justify-center px-4'
                    }
                  >
                    {updatingId === item.id
                      ? 'Menyimpan...'
                      : item.isApproved
                        ? 'Batalkan Approval'
                        : 'Setujui'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="admin-btn admin-btn-danger text-xs w-full sm:w-auto whitespace-nowrap justify-center px-4"
                  >
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
