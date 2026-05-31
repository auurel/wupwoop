'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { generateWhatsAppLink, formatPhoneNumber } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, settingsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/settings'),
        ]);

        const servicesData = await servicesRes.json();
        const settingsData = await settingsRes.json();

        setServices(servicesData);
        if (settingsData.whatsappNumber) {
          setWhatsappNumber(settingsData.whatsappNumber);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
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

  // PERBAIKAN 1: Menambahkan pt-28 pada state LOADING agar skeleton tidak tertutup wave di HP
  if (loading) {
    return (
      <section className="section-padding bg-cream-light" id="services">
        <div className="section-container">
          <div className="h-12 w-80 bg-cream rounded-lg skeleton mx-auto mb-8" />
          <div className="flex flex-wrap gap-4 justify-center">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-cream rounded-full skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    // PERBAIKAN 2: Mengganti "section-padding" menjadi "pt-28 pb-12 md:py-20" pada TAMPILAN UTAMA
    <section className="section-padding bg-cream-light" id="services">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heading-section text-center mb-12 md:mb-16"
        >
          Kami Melayani Jasa
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-wrap gap-3 md:gap-4 justify-center"
        >
          {services
            .sort((a, b) => a.order - b.order)
            .map((service) => (
              <motion.button
                key={service.id}
                variants={itemVariants}
                onClick={() => handleServiceClick(service.name)}
                className="px-3 md:px-6 py-2 md:py-3 bg-cream-peach text-text-dark rounded-full font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 hover:shadow-soft active:scale-95"
              >
                {service.name}
              </motion.button>
            ))}
        </motion.div>
      </div>
    </section>
  );
}