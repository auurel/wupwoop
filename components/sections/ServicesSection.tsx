'use client';

import { useEffect, useState } from 'react';
import { generateWhatsAppLink, formatPhoneNumber, fetchJSONWithTimeout } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

const fallbackServices: Service[] = [
  { id: 'fallback-1', name: 'Jahit Kebaya Custom', slug: 'jahit-kebaya-custom', order: 1 },
  { id: 'fallback-2', name: 'Jahit Gamis Custom', slug: 'jahit-gamis-custom', order: 2 },
  { id: 'fallback-3', name: 'Jahit Seragam Komunitas', slug: 'jahit-seragam-komunitas', order: 3 },
  { id: 'fallback-4', name: 'Jahit Tunik', slug: 'jahit-tunik', order: 4 },
  { id: 'fallback-5', name: 'Jahit Seragam Sekolah', slug: 'jahit-seragam-sekolah', order: 5 },
  { id: 'fallback-6', name: 'Jahit Seragam Kerja', slug: 'jahit-seragam-kerja', order: 6 },
  { id: 'fallback-7', name: 'Jasa Layanan Makloon', slug: 'jasa-layanan-makloon', order: 7 },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [whatsappNumber, setWhatsappNumber] = useState('6281223975431');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, settingsData] = await Promise.all([
          fetchJSONWithTimeout<Service[]>('/api/services', {
            timeoutMs: 7000,
            fallback: fallbackServices,
          }),
          fetchJSONWithTimeout<{ whatsappNumber?: string }>('/api/settings', {
            timeoutMs: 7000,
            fallback: {},
          }),
        ]);

        setServices(servicesData);
        if (settingsData.whatsappNumber) {
          setWhatsappNumber(settingsData.whatsappNumber);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(fallbackServices);
        setWhatsappNumber('6281223975431');
      }
    };

    fetchData();
  }, []);

  const handleServiceClick = (serviceName: string) => {
    if (!whatsappNumber) {
      alert('Nomor WhatsApp belum dikonfigurasi');
      return;
    }

    const message = `Halo Muzayyan, saya ingin bertanya tentang layanan ${serviceName}`;
    const link = generateWhatsAppLink(
      formatPhoneNumber(whatsappNumber),
      message
    );
    window.open(link, '_blank');
  };

  return (
    <section className="section-padding bg-cream-light" id="services">
      <div className="section-container">
        <h2 className="heading-section text-center mb-12 md:mb-16">
          Kami Melayani Jasa
        </h2>

        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          {services
            .sort((a, b) => a.order - b.order)
            .map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.name)}
                className="px-6 md:px-7 py-3 md:py-3.5 bg-cream-peach text-text-dark rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-soft active:scale-95"
              >
                {service.name}
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
