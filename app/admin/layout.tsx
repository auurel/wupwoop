import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Muzayyan',
  description: 'Admin panel untuk mengelola konten website Muzayyan',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
