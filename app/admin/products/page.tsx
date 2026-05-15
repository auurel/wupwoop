'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface Product {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  order: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
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

    fetchProducts(token);
  }, [router]);

  const fetchProducts = async (token: string) => {
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      setProducts(data.data || data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader admin={admin} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="admin-btn admin-btn-primary"
          >
            + Tambah Produk
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : products.length === 0 ? (
          <div className="admin-card text-center">
            <p className="text-gray-600 mb-4">Belum ada produk</p>
            <button
              onClick={() => setShowForm(true)}
              className="admin-btn admin-btn-primary"
            >
              Tambah Produk Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Gambar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="font-semibold">{product.title}</td>
                    <td>{product.category || '-'}</td>
                    <td>
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="admin-btn admin-btn-secondary text-xs">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="admin-btn admin-btn-danger text-xs"
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

        {showForm && (
          <ProductFormModal
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              const token = localStorage.getItem('adminToken');
              if (token) fetchProducts(token);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface ProductFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function ProductFormModal({ onClose, onSuccess }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menambah produk');

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-8 max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">Tambah Produk</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="admin-form-label">Judul</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="admin-input"
            placeholder="Nama produk"
          />
        </div>

        <div>
          <label className="admin-form-label">Kategori</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="admin-input"
            placeholder="Gamis, Tunik, dll"
          />
        </div>

        <div>
          <label className="admin-form-label">URL Gambar</label>
          <input
            type="url"
            required
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
            className="admin-input"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="admin-form-label">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="admin-textarea"
            placeholder="Deskripsi produk"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 admin-btn admin-btn-secondary"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 admin-btn admin-btn-primary disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
