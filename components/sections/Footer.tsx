'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, Facebook, Instagram, Music } from 'lucide-react';
import { fetchJSONWithTimeout } from '@/lib/utils';

interface OperatingHours {
  day: string;
  dayLabel: string;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
}

interface SiteSettings {
  address: string;
  postalCode: string;
  mapEmbedUrl: string;
  tiktokUrl?: string;
  tiktokUsername?: string;
  instagramUrl?: string;
  instagramUsername?: string;
  facebookUrl?: string;
  facebookUsername?: string;
}

const fallbackHours: OperatingHours[] = [
  { day: 'monday', dayLabel: 'Senin', openTime: '07:30', closeTime: '16:30', isClosed: false },
  { day: 'tuesday', dayLabel: 'Selasa', openTime: '07:30', closeTime: '16:30', isClosed: false },
  { day: 'wednesday', dayLabel: 'Rabu', openTime: '07:30', closeTime: '16:30', isClosed: false },
  { day: 'thursday', dayLabel: 'Kamis', openTime: '07:30', closeTime: '16:30', isClosed: false },
  { day: 'friday', dayLabel: "Jum'at", openTime: '07:30', closeTime: '16:30', isClosed: false },
  { day: 'saturday', dayLabel: 'Sabtu', openTime: '07:30', closeTime: '16:30', isClosed: false },
  { day: 'sunday', dayLabel: 'Minggu', openTime: '07:30', closeTime: '16:30', isClosed: false },
];

const fallbackSettings: SiteSettings = {
  address: 'Jl Ahmad Yani No 83 Kebumen, Jawa Tengah',
  postalCode: '54311',
  mapEmbedUrl: '',
  tiktokUsername: 'ruang_jahit_muzzayan',
  instagramUsername: 'ruangjahitmuzzayan',
  facebookUsername: 'Muzayyan Id',
};

export default function Footer() {
  const [hours, setHours] = useState<OperatingHours[]>(fallbackHours);
  const [settings, setSettings] = useState<SiteSettings | null>(fallbackSettings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hoursData, settingsData] = await Promise.all([
          fetchJSONWithTimeout<OperatingHours[]>('/api/operating-hours', {
            timeoutMs: 7000,
            fallback: [],
          }),
          fetchJSONWithTimeout<SiteSettings | null>('/api/settings', {
            timeoutMs: 7000,
            fallback: {
              address: 'Kebumen, Jawa Tengah',
              postalCode: '',
              mapEmbedUrl: '',
            },
          }),
        ]);

        setHours(hoursData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching footer data:', error);
        setHours(fallbackHours);
        setSettings(fallbackSettings);
      }
    };

    fetchData();
  }, []);

  const getTodayHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return hours.find((h) => h.day === today);
  };

  const todayHours = getTodayHours();
  const isOpen = todayHours && !todayHours.isClosed;

  return (
    <footer id="about-us" className="bg-cream-light text-text-dark">
      <section className="section-padding">
        <div className="section-container">
          <h2 className="heading-section text-center mb-12">Tentang Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {/* Operating Hours */}
            <div className="bg-cream rounded-2xl p-6 md:p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-primary" />
                <h3 className="text-xl font-bold text-text-dark">Jam Operasional</h3>
              </div>

              <div className="space-y-3">
                {hours.map((hour) => (
                  <div key={hour.day} className="flex justify-between text-sm">
                    <span className="font-semibold">{hour.dayLabel}</span>
                    <span className={hour.isClosed ? 'text-red-500 font-semibold' : ''}>
                      {hour.isClosed
                        ? 'Libur'
                        : `${hour.openTime} - ${hour.closeTime} WIB`}
                    </span>
                  </div>
                ))}
              </div>

              {isOpen && (
                <div className="mt-6 p-3 bg-green-100 rounded-lg text-green-700 text-sm font-semibold text-center">
                  ✓ Buka Sekarang
                </div>
              )}
            </div>

            {/* Contact & Social Media */}
            <div className="bg-cream rounded-2xl p-6 md:p-8 shadow-soft space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Ikuti Kami</h3>
                <div className="space-y-3">
                  {settings?.tiktokUsername && (
                    <a
                      href={settings.tiktokUrl || `https://tiktok.com/@${settings.tiktokUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-body hover:text-primary transition-colors"
                    >
                      <Music size={20} />
                      <span>@{settings.tiktokUsername}</span>
                    </a>
                  )}
                  {settings?.instagramUsername && (
                    <a
                      href={settings.instagramUrl || `https://instagram.com/${settings.instagramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-body hover:text-primary transition-colors"
                    >
                      <Instagram size={20} />
                      <span>@{settings.instagramUsername}</span>
                    </a>
                  )}
                  {settings?.facebookUsername && (
                    <a
                      href={settings.facebookUrl || `https://facebook.com/${settings.facebookUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-body hover:text-primary transition-colors"
                    >
                      <Facebook size={20} />
                      <span>{settings.facebookUsername}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-bold text-text-dark mb-3 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Alamat
                </h3>
                {settings && (
                  <p className="text-sm leading-relaxed text-text-body">
                    {settings.address}
                    <br />
                    Kode pos {settings.postalCode}
                  </p>
                )}
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-cream rounded-2xl p-6 md:p-8 overflow-hidden shadow-soft">
              {settings?.mapEmbedUrl && (
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <div className="border-t border-primary/20 py-8 bg-cream-light/50">
        <div className="section-container text-center">
          <p className="text-sm text-text-body">
            © {new Date().getFullYear()} Muzayyan - Jasa Jahit & Penjualan Produk Ready-to-Wear. All
            rights reserved.
          </p>
          <p className="text-xs text-text-body/60 mt-2">
            Berdiri sejak 1 Maret 2017 | Kebumen, Jawa Tengah
          </p>
        </div>
      </div>
    </footer>
  );
}
