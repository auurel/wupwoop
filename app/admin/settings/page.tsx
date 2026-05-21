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
  const [showForm, setShowForm] = useState(false);

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

    fetchSettings(token);
  }, [router]);

  const fetchSettings = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Site</h1>
          <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
            Edit Pengaturan
          </button>
        </div>

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
          </div>
        ) : (
          <div className="admin-card">
            <p className="text-red-600">Gagal memuat pengaturan</p>
          </div>
        )}

        {showForm && settings && (
          <SettingsFormModal
            settings={settings}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              const token = localStorage.getItem('adminToken');
              fetchSettings(token || undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

function SettingsFormModal({
  settings,
  onClose,
  onSuccess,
}: {
  settings: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    whatsappNumber: settings.whatsappNumber || '',
    defaultWhatsappMessage: settings.defaultWhatsappMessage || '',
    address: settings.address || '',
    postalCode: settings.postalCode || '',
    mapEmbedUrl: settings.mapEmbedUrl || '',
    tiktokUrl: settings.tiktokUrl || '',
    tiktokUsername: settings.tiktokUsername || '',
    instagramUrl: settings.instagramUrl || '',
    instagramUsername: settings.instagramUsername || '',
    facebookUrl: settings.facebookUrl || '',
    facebookUsername: settings.facebookUsername || '',
    heroTitle: settings.heroTitle || '',
    heroSubtitle: settings.heroSubtitle || '',
    aboutTitle: settings.aboutTitle || '',
    aboutContent: settings.aboutContent || '',
    aboutImageUrl: settings.aboutImageUrl || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menyimpan pengaturan');

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 max-w-3xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900">Edit Pengaturan</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-form-label">Nomor WhatsApp</label>
            <input type="text" value={formData.whatsappNumber} onChange={(e) => setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Kode Pos</label>
            <input type="text" value={formData.postalCode} onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="admin-form-label">Default Pesan WhatsApp</label>
          <textarea value={formData.defaultWhatsappMessage} onChange={(e) => setFormData((prev) => ({ ...prev, defaultWhatsappMessage: e.target.value }))} className="admin-textarea" rows={3} />
        </div>
        <div>
          <label className="admin-form-label">Alamat</label>
          <textarea value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} className="admin-textarea" rows={3} />
        </div>
        <div>
          <label className="admin-form-label">Map Embed URL</label>
          <input type="url" value={formData.mapEmbedUrl} onChange={(e) => setFormData((prev) => ({ ...prev, mapEmbedUrl: e.target.value }))} className="admin-input" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-form-label">Instagram Username</label>
            <input type="text" value={formData.instagramUsername} onChange={(e) => setFormData((prev) => ({ ...prev, instagramUsername: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Instagram URL</label>
            <input type="url" value={formData.instagramUrl} onChange={(e) => setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">TikTok Username</label>
            <input type="text" value={formData.tiktokUsername} onChange={(e) => setFormData((prev) => ({ ...prev, tiktokUsername: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">TikTok URL</label>
            <input type="url" value={formData.tiktokUrl} onChange={(e) => setFormData((prev) => ({ ...prev, tiktokUrl: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Facebook Username</label>
            <input type="text" value={formData.facebookUsername} onChange={(e) => setFormData((prev) => ({ ...prev, facebookUsername: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-form-label">Facebook URL</label>
            <input type="url" value={formData.facebookUrl} onChange={(e) => setFormData((prev) => ({ ...prev, facebookUrl: e.target.value }))} className="admin-input" />
          </div>
        </div>

        <div>
          <label className="admin-form-label">Hero Title</label>
          <input type="text" value={formData.heroTitle} onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))} className="admin-input" />
        </div>
        <div>
          <label className="admin-form-label">Hero Subtitle</label>
          <textarea value={formData.heroSubtitle} onChange={(e) => setFormData((prev) => ({ ...prev, heroSubtitle: e.target.value }))} className="admin-textarea" rows={3} />
        </div>
        <div>
          <label className="admin-form-label">About Title</label>
          <input type="text" value={formData.aboutTitle} onChange={(e) => setFormData((prev) => ({ ...prev, aboutTitle: e.target.value }))} className="admin-input" />
        </div>
        <div>
          <label className="admin-form-label">About Content</label>
          <textarea value={formData.aboutContent} onChange={(e) => setFormData((prev) => ({ ...prev, aboutContent: e.target.value }))} className="admin-textarea" rows={5} />
        </div>
        <div>
          <label className="admin-form-label">About Image URL</label>
          <input type="url" value={formData.aboutImageUrl} onChange={(e) => setFormData((prev) => ({ ...prev, aboutImageUrl: e.target.value }))} className="admin-input" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 admin-btn admin-btn-secondary">Batal</button>
          <button type="submit" disabled={loading} className="flex-1 admin-btn admin-btn-primary disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
