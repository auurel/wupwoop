import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import SiteChrome from '@/components/layout/SiteChrome';
import { SpeedInsights } from '@vercel/speed-insights/next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Muzayyan - Jasa Jahit & Penjualan Produk Ready-to-Wear',
  description:
    'Layanan jasa jahit dan penjualan produk ready to wear terpercaya di Kebumen, Jawa Tengah. Kami menyediakan jahit custom, seragam, dan fashion sustainable.',
  keywords:
    'jahit custom, gamis, seragam, kebaya, jasa jahit kebumen, fashion muslimah',
  openGraph: {
    title: 'Muzayyan - Jasa Jahit & Penjualan Produk Ready-to-Wear',
    description:
      'Layanan jasa jahit dan penjualan produk ready to wear terpercaya di Kebumen, Jawa Tengah.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${playfair.variable}`}>
      <body className="bg-cream-light">
        <SiteChrome>{children}</SiteChrome>
        <SpeedInsights />
      </body>
    </html>
  );
}
