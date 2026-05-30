'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  MessageSquare,
  Clock,
  Settings,
  Mail,
  UserCircle2,
  LogOut,
  Users,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/products', icon: Package },
  { label: 'Layanan', href: '/admin/services', icon: Briefcase },
  { label: 'Testimoni', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Jam Operasional', href: '/admin/hours', icon: Clock },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Mail },
  { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
  { label: 'Kelola Admin', href: '/admin/admins', icon: Users },
  { label: 'Profil Admin', href: '/admin/profile', icon: UserCircle2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = '/admin/login';
  };

  return (
    <>
      <div className="admin-mobile-topbar md:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-base font-bold">
          <img
            src="/images/logo.svg"
            alt="Muzayyan Logo"
            className="w-8 h-8 rounded-full bg-white/70 p-1 object-contain"
          />
          <span>Muzayyan Admin</span>
        </Link>
        <button
          type="button"
          aria-label="Buka menu admin"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-[color:var(--color-text-dark)] hover:bg-white/50"
        >
          <Menu size={20} />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Tutup menu admin"
          className="admin-mobile-overlay md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-inner">
          <div className="px-6 mb-8 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-xl font-bold">
              <img
                src="/images/logo.svg"
                alt="Muzayyan Logo"
                className="w-10 h-10 rounded-full bg-white/70 p-1 object-contain"
              />
              <span>Muzayyan</span>
            </Link>
            <button
              type="button"
              aria-label="Tutup menu admin"
              onClick={() => setIsOpen(false)}
              className="md:hidden rounded-lg p-2 text-[color:var(--color-text-dark)] hover:bg-white/50"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'admin-sidebar-active'
                      : 'admin-sidebar-link'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-logout px-4 mt-6 md:mt-auto">
            <button
              onClick={handleLogout}
              className="w-full admin-sidebar-link hover:bg-orange-100"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
