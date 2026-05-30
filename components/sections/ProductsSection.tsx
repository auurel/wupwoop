'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchJSONWithTimeout } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  order: number;
}

const fallbackProducts: Product[] = [
  { id: 'fallback-product-1', title: 'Gamis Cokelat', imageUrl: '/images/tunik-1.svg', order: 1 },
  { id: 'fallback-product-2', title: 'Tunik Hitam', imageUrl: '/images/tunik-2.svg', order: 2 },
  { id: 'fallback-product-3', title: 'Kain Batik Premium', imageUrl: '/images/tunik-3.svg', order: 3 },
  { id: 'fallback-product-4', title: 'Gamis Krem', imageUrl: '/images/oneset.svg', order: 4 },
];

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const sortedProducts = [...products].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const payload = await fetchJSONWithTimeout<{ data?: Product[] } | Product[]>('/api/products', {
          timeoutMs: 7000,
          fallback: { data: [] },
        });
        // API returns { data: Product[] , pagination: {...} }
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        setProducts(list);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(fallbackProducts);
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

  return (
    <>
      <section className="section-padding bg-cream-light" id="products">
        <div className="section-container">
          <h2 className="heading-section text-center mb-12 md:mb-16">
            Potret Produk Kami
          </h2>

          {sortedProducts.length > 0 ? (
            <div
              className="flex gap-4 md:gap-5 overflow-x-auto overflow-y-hidden pb-4 pr-1 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group snap-start flex-none w-[80%] sm:w-[45%] lg:w-[calc((100%-4.5rem)/4)] cursor-default"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md pointer-events-none">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-cream p-5 text-center text-text-body">
              Produk belum tersedia saat ini. Coba refresh beberapa saat lagi.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
