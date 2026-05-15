'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
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
  }, []);

  const handleProductClick = (product: Product, index: number) => {
    setSelectedProduct(product);
    setSelectedIndex(index);
  };

  const handleNext = () => {
    const newIndex = (selectedIndex + 1) % products.length;
    setSelectedProduct(products[newIndex]);
    setSelectedIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (selectedIndex - 1 + products.length) % products.length;
    setSelectedProduct(products[newIndex]);
    setSelectedIndex(newIndex);
  };

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
            className="heading-section text-center mb-12 md:mb-16"
          >
            Potret Produk Kami
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {products
              .sort((a, b) => a.order - b.order)
              .map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  onClick={() => handleProductClick(product, index)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors z-10"
              aria-label="Close"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="bg-cream-light p-6 rounded-b-3xl">
              <h3 className="text-xl md:text-2xl font-bold text-text-dark mb-2">
                {selectedProduct.title}
              </h3>
              {selectedProduct.description && (
                <p className="text-text-body mb-4">{selectedProduct.description}</p>
              )}
              {selectedProduct.category && (
                <p className="text-sm text-primary font-semibold mb-4">
                  {selectedProduct.category}
                </p>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  ← Sebelumnya
                </button>
                <span className="text-sm text-text-body">
                  {selectedIndex + 1} / {products.length}
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
