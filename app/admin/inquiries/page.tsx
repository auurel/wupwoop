'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export default function InquiriesPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);

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

    fetchInquiries(token);
  }, [router]);

  const fetchInquiries = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error('Failed to fetch inquiries');

      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus inquiry ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setInquiries(inquiries.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
        </div>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : inquiries.length === 0 ? (
          <div className="admin-card text-center">
            <p className="text-gray-600">Belum ada inquiries masuk</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((item) => (
              <div key={item.id} className="admin-card space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.phone}{item.email ? ` • ${item.email}` : ''}</p>
                    <p className="text-sm text-gray-600 mt-2">Layanan: {item.service || '-'}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      {item.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingInquiry(item);
                        setShowForm(true);
                      }}
                      className="admin-btn admin-btn-secondary text-xs"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger text-xs">
                      Hapus
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <InquiryFormModal
            inquiry={editingInquiry}
            onClose={() => {
              setShowForm(false);
              setEditingInquiry(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingInquiry(null);
              const token = localStorage.getItem('adminToken');
              fetchInquiries(token || undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

function InquiryFormModal({
  inquiry,
  onClose,
  onSuccess,
}: {
  inquiry?: Inquiry | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: inquiry?.name || '',
    phone: inquiry?.phone || '',
    email: inquiry?.email || '',
    service: inquiry?.service || '',
    message: inquiry?.message || '',
    status: inquiry?.status || 'new',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/inquiries/${inquiry?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal memperbarui inquiry');

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 max-w-lg w-full space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Edit Inquiry</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="admin-form-label">Nama</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Phone</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} className="admin-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="admin-form-label">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Layanan</label>
            <input type="text" value={formData.service} onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="admin-form-label">Status</label>
          <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))} className="admin-select">
            <option value="new">new</option>
            <option value="read">read</option>
            <option value="responded">responded</option>
            <option value="closed">closed</option>
          </select>
        </div>
        <div>
          <label className="admin-form-label">Pesan</label>
          <textarea value={formData.message} onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))} className="admin-textarea" rows={5} />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 admin-btn admin-btn-secondary">Batal</button>
          <button type="submit" disabled={loading} className="flex-1 admin-btn admin-btn-primary disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
