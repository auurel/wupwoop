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
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

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

    fetchServices(token);
  }, [router]);

  const fetchServices = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/services', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setServices(services.filter((service) => service.id !== id));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowForm(true);
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

        <div className="flex justify-end mb-6">
          <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
            + Tambah Layanan
          </button>
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
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="flex items-start gap-4 p-4 bg-white border-l-4 border-orange-400 rounded hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">#{service.order}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    {service.description && (
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {service.isActive ? '✓ Aktif' : '✗ Tidak Aktif'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(service)} className="admin-btn admin-btn-secondary text-xs">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="admin-btn admin-btn-danger text-xs">
                      Hapus
                    </button>
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

        {showForm && (
          <ServiceFormModal
            service={editingService}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              setEditingService(null);
              const token = localStorage.getItem('adminToken');
              fetchServices(token || undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

function ServiceFormModal({ service, onClose, onSuccess }: { service?: any; onClose: () => void; onSuccess: () => void; }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    slug: service?.slug || '',
    description: service?.description || '',
    order: service?.order ?? 0,
    isActive: service?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(service ? `/api/admin/services/${service.id}` : '/api/admin/services', {
        method: service ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(service ? 'Gagal memperbarui layanan' : 'Gagal menambah layanan');

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{service ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="admin-form-label">Nama</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className="admin-input" />
        </div>
        <div>
          <label className="admin-form-label">Slug</label>
          <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} className="admin-input" placeholder="opsional" />
        </div>
        <div>
          <label className="admin-form-label">Deskripsi</label>
          <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className="admin-textarea" rows={3} />
        </div>
        <div>
          <label className="admin-form-label">Urutan</label>
          <input type="number" value={formData.order} onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))} className="admin-input" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))} /> Aktif
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 admin-btn admin-btn-secondary">Batal</button>
          <button type="submit" disabled={loading} className="flex-1 admin-btn admin-btn-primary disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
