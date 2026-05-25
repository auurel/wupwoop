'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  lastLogin?: string | null;
};

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'admin',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setAdmin(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          currentPassword: '',
          newPassword: '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan profil');

      setAdmin(data.admin);
      localStorage.setItem('adminData', JSON.stringify(data.admin));
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
      }));
      setMessage('Profil admin berhasil diperbarui.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');
    setInviteMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal membuat undangan');

      setInviteData({ name: '', email: '', role: 'admin' });
      setInviteMessage('Undangan berhasil dibuat. Buka email terdaftar untuk aktivasi.');
      if (data.mailto) {
        window.open(data.mailto, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin || undefined} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profil Admin</h1>
        </div>

        {loading ? (
          <div className="text-center py-8">Memuat profil...</div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            <div className="admin-card">
              <div className="mb-6">
                <p className="text-sm text-gray-500">Akun aktif</p>
                <h2 className="text-xl font-semibold text-gray-900">{admin?.name}</h2>
                <p className="text-sm text-gray-600">{admin?.email}</p>
              </div>

              {error && <div className="mb-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
              {message && <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="admin-form-label">Username / Nama Admin</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="admin-input"
                  placeholder="Nama admin"
                />
              </div>

              <div>
                <label className="admin-form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="admin-input"
                  placeholder="admin@muzayyan.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Password Saat Ini</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="admin-input"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Password Baru</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="admin-input"
                    placeholder="Isi jika ingin ganti password"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="admin-btn admin-btn-secondary flex-1"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary flex-1 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
            </div>

            <div className="admin-card max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Undang Admin Baru</h2>

              {inviteError && <div className="mb-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{inviteError}</div>}
              {inviteMessage && <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{inviteMessage}</div>}

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-form-label">Nama</label>
                    <input
                      type="text"
                      required
                      value={inviteData.name}
                      onChange={(e) => setInviteData((prev) => ({ ...prev, name: e.target.value }))}
                      className="admin-input"
                      placeholder="Nama admin baru"
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Email</label>
                    <input
                      type="email"
                      required
                      value={inviteData.email}
                      onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                      className="admin-input"
                      placeholder="email@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-form-label">Role</label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData((prev) => ({ ...prev, role: e.target.value }))}
                    className="admin-select"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="admin-btn admin-btn-primary disabled:opacity-50"
                  >
                    {inviteLoading ? 'Membuat undangan...' : 'Buat Undangan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}