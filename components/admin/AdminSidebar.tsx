'use client';

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
  LogOut,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/products', icon: Package },
  { label: 'Layanan', href: '/admin/services', icon: Briefcase },
  { label: 'Testimoni', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Jam Operasional', href: '/admin/hours', icon: Clock },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Mail },
  { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link href="/admin" className="flex items-center gap-2 text-xl font-bold">
          <img
            src="/images/logo.svg"
            alt="Muzayyan Logo"
            className="w-10 h-10 rounded-full bg-white/70 p-1 object-contain"
          />
          <span>Muzayyan</span>
        </Link>
      </div>

      {/* Menu */}
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

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full admin-sidebar-link hover:bg-orange-100"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
