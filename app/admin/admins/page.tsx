'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import PasswordField from '@/components/admin/PasswordField';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
};

type FormState = {
  name: string;
  email: string;
  role: string;
  password: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  role: 'admin',
  password: '',
};

export default function AdminManagementPage() {
  const router = useRouter();
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isEditing = useMemo(() => Boolean(editingAdminId), [editingAdminId]);
  const canManageAdminRoles = currentAdmin?.role === 'superadmin';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (adminData) {
      try {
        setCurrentAdmin(JSON.parse(adminData));
      } catch {
        setCurrentAdmin(null);
      }
    }

    fetchAdmins(token);
  }, [router]);

  const fetchAdmins = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/admins', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal memuat data admin');

      setAdmins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat admin');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingAdminId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    if (!isEditing && !canManageAdminRoles) {
      setSaving(false);
      setError('Hanya superadmin yang dapat menambahkan admin baru');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = isEditing ? `/api/admin/admins/${editingAdminId}` : '/api/admin/admins';
      const method = isEditing ? 'PUT' : 'POST';

      const payload: Partial<FormState> = {
        name: form.name.trim(),
        email: form.email.trim(),
      };

      if (isEditing) {
        if (canManageAdminRoles) {
          payload.role = form.role;
        }
      } else {
        payload.role = form.role;
      }

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan admin');

      if (isEditing) {
        setAdmins((prev) => prev.map((item) => (item.id === data.id ? data : item)));

        if (currentAdmin && currentAdmin.id === data.id) {
          const merged = { ...currentAdmin, ...data };
          setCurrentAdmin(merged);
          localStorage.setItem('adminData', JSON.stringify(merged));
        }

        setMessage('Data admin berhasil diperbarui.');
      } else {
        setAdmins((prev) => [data, ...prev]);
        setMessage('Admin baru berhasil ditambahkan.');
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (admin: AdminUser) => {
    setError('');
    setMessage('');
    setEditingAdminId(admin.id);
    setForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: '',
    });
  };

  const canDeleteAdmin = (admin: AdminUser) => {
    if (!currentAdmin) {
      return false;
    }

    if (currentAdmin.id === admin.id) {
      return false;
    }

    if (currentAdmin.role === 'admin') {
      return false;
    }

    if (currentAdmin.role === 'superadmin' && admin.role === 'superadmin') {
      return false;
    }

    return true;
  };

  const handleDelete = async (admin: AdminUser) => {
    const confirmed = window.confirm(`Yakin ingin menghapus admin ${admin.name}?`);
    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus admin');

      setAdmins((prev) => prev.filter((item) => item.id !== admin.id));
      setMessage('Admin berhasil dihapus.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={currentAdmin || undefined} />

        <div className="mb-8">
          <h1>Kelola Admin</h1>
        </div>

        {error && <div className="mb-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {message && <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}

        <div className="admin-card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEditing ? 'Edit Admin' : 'Tambah Admin Baru'}</h2>

          {!isEditing && !canManageAdminRoles ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Hanya superadmin yang dapat menambahkan admin baru.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Nama</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="admin-input"
                  placeholder="Nama admin"
                />
              </div>

              <div>
                <label className="admin-form-label">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="admin-input"
                  placeholder="admin@domain.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="admin-select"
                  disabled={!canManageAdminRoles && isEditing}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
                {!canManageAdminRoles && isEditing && (
                  <p className="mt-2 text-xs text-gray-500">Role hanya bisa diubah oleh superadmin.</p>
                )}
              </div>

              <PasswordField
                label={`Password ${isEditing ? '(opsional)' : ''}`}
                required={!isEditing}
                value={form.password}
                onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
                placeholder={isEditing ? 'Isi jika ingin ganti password' : 'Minimal 8 karakter'}
              />
            </div>

            <div className="flex gap-3">
              {isEditing && (
                <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                  Batal Edit
                </button>
              )}
              <button type="submit" disabled={saving} className="admin-btn admin-btn-primary disabled:opacity-50">
                {saving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Admin'}
              </button>
            </div>
            </form>
          )}
        </div>

        <div className="admin-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daftar Admin</h2>

          {loading ? (
            <div className="text-center py-8">Memuat data admin...</div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Belum ada data admin.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('id-ID') : '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEdit(admin)} className="admin-btn admin-btn-secondary text-xs">
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(admin)}
                            className="admin-btn admin-btn-danger text-xs disabled:opacity-50"
                            disabled={!canDeleteAdmin(admin)}
                            title={
                              currentAdmin?.id === admin.id
                                ? 'Tidak dapat menghapus akun sendiri'
                                : currentAdmin?.role === 'admin'
                                  ? 'Role admin tidak memiliki izin untuk menghapus admin'
                                  : currentAdmin?.role === 'superadmin' && admin.role === 'superadmin'
                                    ? 'Superadmin tidak dapat menghapus superadmin lain'
                                    : 'Hapus admin'
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
