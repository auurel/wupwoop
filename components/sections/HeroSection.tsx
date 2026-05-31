'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[580px] md:h-[730px] flex items-center justify-center pb-8 md:pb-20 hero-batik"
      id="hero"
    >
      {/* Batik background applied via CSS (.hero-batik) */}
      <div className="w-[min(96vw,1600px)] mx-auto px-[clamp(12px,2vw,32px)] flex items-center justify-center">
        <div className="hero-content w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center w-full"
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif italic text-text-dark mb-4 sm:mb-6 md:mb-8 max-w-3xl font-flamante"
          >
            Wujudkan Pakaian Impian Anda
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm md:text-lg lg:text-xl text-text-body max-w-2xl leading-relaxed font-nunito"
          >
            Solusi jahit gamis, koko, dan seragam terpercaya. Pengerjaan tepat waktu dengan kualitas
            jahitan kelas atas yang membuat Anda tampil lebih percaya diri.
          </motion.p>
        </motion.div>
      </div>

        </div>

      {/* Mobile-only inline wave to guarantee precise overlap on small screens */}
      <img
        src="/images/wave-phones.svg"
        alt="wave"
        className="hero-mobile-wave pointer-events-none md:hidden absolute left-0 right-0 bottom-0 w-full h-auto translate-y-[64px] scale-y-125 transform origin-bottom"
        style={{ zIndex: 1 }}
      />

      {/* Wavy Divider */}
      <div className="absolute bottom-0 left-0 right-0 wavy-divider" />
    </section>
  );
}
