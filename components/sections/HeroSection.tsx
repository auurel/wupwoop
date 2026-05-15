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
      className="relative min-h-screen flex items-center pt-20 pb-16 md:pb-24 lg:pb-32 pattern-damask bg-cream-light"
      id="hero"
    >
      <div className="max-w-container mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center w-full"
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-text-dark mb-6 md:mb-8 max-w-3xl"
          >
            Wujudkan Pakaian Impian Anda
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-text-body max-w-2xl leading-relaxed"
          >
            Solusi jahit gamis, koko, dan seragam terpercaya. Pengerjaan tepat waktu dengan kualitas
            jahitan kelas atas yang membuat Anda tampil lebih percaya diri.
          </motion.p>
        </motion.div>
      </div>

      {/* Wavy Divider */}
      <div className="absolute bottom-0 left-0 right-0 wavy-divider" />
    </section>
  );
}
