'use client';

import { useEffect, useState } from 'react';
import { generateWhatsAppLink, formatPhoneNumber } from '@/lib/utils';

export default function CTASection() {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) {
      alert('Nomor WhatsApp belum dikonfigurasi');
      return;
    }

    const message = 'Halo Muzayyan, saya ingin bertanya lebih lanjut tentang layanan Anda';
    const link = generateWhatsAppLink(formatPhoneNumber(whatsappNumber), message);
    window.open(link, '_blank');
  };

  return (
    <section className="section-padding bg-cream-light">
      <div className="section-container">
          <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="heading-section">Tanya Lebih Lanjut</h2>

          <p className="text-lg md:text-xl text-text-body leading-relaxed">
            Ingin bertanya lebih banyak? Kami siap melayani anda, silahkan hubungi whatsapp kami
          </p>

            <button
              onClick={handleWhatsAppClick}
              className="px-10 py-4 bg-cream-peach text-text-dark rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-soft hover:animate-pulse-glow"
            >
            Klik Untuk Mengirim Pesan
            </button>
          </div>
      </div>
    </section>
  );
}
