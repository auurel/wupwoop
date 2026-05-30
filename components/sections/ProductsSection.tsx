'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sortedProducts = [...products].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const payload = await res.json();
        // API returns { data: Product[] , pagination: {...} }
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        setProducts(list);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const refetchOnVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };

    window.addEventListener('focus', fetchProducts);
    document.addEventListener('visibilitychange', refetchOnVisible);
    const intervalId = window.setInterval(fetchProducts, 15000);

    return () => {
      window.removeEventListener('focus', fetchProducts);
      document.removeEventListener('visibilitychange', refetchOnVisible);
      window.clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-cream-light" id="products">
        <div className="section-container">
          <div className="h-12 w-80 bg-cream rounded-lg skeleton mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-cream rounded-3xl skeleton"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-padding bg-cream-light" id="products">
        <div className="section-container">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-section text-center text-xl md:text-3xl mb-8 md:mb-16"
          >
            Potret Produk Kami
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex gap-2 md:gap-5 overflow-x-auto overflow-y-hidden pb-4 pr-1 snap-x snap-mandatory scroll-smooth touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group snap-start flex-none w-[80%] sm:w-[45%] lg:w-[calc((100%-4.5rem)/4)] cursor-default"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
