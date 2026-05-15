'use client';

import { motion } from 'framer-motion';
// use native <img> for the SVG to avoid next/image optimization issues

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function AboutSection() {
  return (
    <section
      className="relative bg-gradient-about py-16 md:py-24 lg:py-32"
      id="about-us"
    >
      <div className="max-w-container mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
        >
          {/* Image */}
          <motion.div variants={imageVariants} className="flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-md md:max-w-md lg:max-w-lg z-0">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/images/Group 57.svg"
                  alt="Muzayyan - Jahit Custom"
                  width={1100}
                  height={720}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark">Muzayyan</h2>

            <div className="space-y-4 text-justify leading-relaxed text-text-body">
              <p>
                <strong>Muzayyan</strong> merupakan layanan jasa jahit dan penjualan produk ready to
                wear yang berdiri sejak 1 maret 2017. Muzayyan menerima jasa jahit costum, seragam
                dan makloon dengan kebijakan masing-masing harga sesuai kategori. Selain itu
                muzayyan juga menyediakan produk ready to wear seperti gamis, tunik, dailly wear.
              </p>

              <p>
                Muzayyan mulai menerapkan sustainable fashion dimulai dari memanfaatkan perca kain
                untuk membuat souvenir seperti ganci, lanyard, tempat tisu, tempat pensil, tas
                serut dll
              </p>
            </div>

            {/* Stats atau Additional Info */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Berdiri sejak 1 Maret 2017</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Fokus pada kualitas dan kepuasan pelanggan</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Menerapkan sustainable fashion</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
