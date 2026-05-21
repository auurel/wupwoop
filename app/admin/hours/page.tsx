'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

type OperatingHour = {
  id: string;
  day: string;
  dayLabel: string;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  order: number;
};

const dayOptions = [
  { day: 'monday', dayLabel: 'Senin' },
  { day: 'tuesday', dayLabel: 'Selasa' },
  { day: 'wednesday', dayLabel: 'Rabu' },
  { day: 'thursday', dayLabel: 'Kamis' },
  { day: 'friday', dayLabel: 'Jum\'at' },
  { day: 'saturday', dayLabel: 'Sabtu' },
  { day: 'sunday', dayLabel: 'Minggu' },
];

export default function HoursPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [hours, setHours] = useState<OperatingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHour, setEditingHour] = useState<OperatingHour | null>(null);

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

    fetchHours(token);
  }, [router]);

  const fetchHours = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/operating-hours', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error('Failed to fetch operating hours');

      const data = await res.json();
      setHours(data);
    } catch (error) {
      console.error('Error fetching operating hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jam operasional ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/operating-hours/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setHours(hours.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting operating hours:', error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jam Operasional</h1>
            <p className="text-gray-600">Kelola jadwal jam operasional Muzayyan</p>
          </div>
          <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
            + Tambah Jadwal
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : hours.length === 0 ? (
          <div className="admin-card text-center">
            <p className="text-gray-600 mb-4">Belum ada jadwal jam operasional</p>
            <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
              Tambah Jadwal Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Label</th>
                  <th>Jam</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold">{item.day}</td>
                    <td>{item.dayLabel}</td>
                    <td>{item.isClosed ? 'Libur' : `${item.openTime} - ${item.closeTime}`}</td>
                    <td>{item.isClosed ? 'Tutup' : 'Buka'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingHour(item); setShowForm(true); }} className="admin-btn admin-btn-secondary text-xs">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger text-xs">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <OperatingHoursFormModal
            hour={editingHour}
            onClose={() => {
              setShowForm(false);
              setEditingHour(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingHour(null);
              const token = localStorage.getItem('adminToken');
              fetchHours(token || undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

function OperatingHoursFormModal({
  hour,
  onClose,
  onSuccess,
}: {
  hour?: OperatingHour | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    day: hour?.day || 'monday',
    dayLabel: hour?.dayLabel || 'Senin',
    openTime: hour?.openTime || '07:30',
    closeTime: hour?.closeTime || '16:30',
    isClosed: hour?.isClosed || false,
    order: hour?.order ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(hour ? `/api/admin/operating-hours/${hour.id}` : '/api/admin/operating-hours', {
        method: hour ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(hour ? 'Gagal memperbarui jadwal' : 'Gagal menambah jadwal');

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
        <h2 className="text-2xl font-bold text-gray-900">{hour ? 'Edit Jadwal' : 'Tambah Jadwal'}</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="admin-form-label">Hari</label>
          <select
            value={formData.day}
            onChange={(e) => {
              const selected = dayOptions.find((d) => d.day === e.target.value);
              setFormData((prev) => ({
                ...prev,
                day: e.target.value,
                dayLabel: selected?.dayLabel || prev.dayLabel,
              }));
            }}
            className="admin-select"
          >
            {dayOptions.map((day) => (
              <option key={day.day} value={day.day}>
                {day.dayLabel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-form-label">Label Hari</label>
          <input type="text" value={formData.dayLabel} onChange={(e) => setFormData((prev) => ({ ...prev, dayLabel: e.target.value }))} className="admin-input" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="admin-form-label">Buka</label>
            <input type="time" value={formData.openTime} disabled={formData.isClosed} onChange={(e) => setFormData((prev) => ({ ...prev, openTime: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Tutup</label>
            <input type="time" value={formData.closeTime} disabled={formData.isClosed} onChange={(e) => setFormData((prev) => ({ ...prev, closeTime: e.target.value }))} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="admin-form-label">Urutan</label>
          <input type="number" value={formData.order} onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))} className="admin-input" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={formData.isClosed} onChange={(e) => setFormData((prev) => ({ ...prev, isClosed: e.target.checked }))} /> Tutup pada hari ini
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 admin-btn admin-btn-secondary">Batal</button>
          <button type="submit" disabled={loading} className="flex-1 admin-btn admin-btn-primary disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
