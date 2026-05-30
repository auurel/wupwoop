'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  customerName: string;
  customerInitial?: string;
  avatarUrl?: string;
  rating: number;
  message: string;
  isApproved: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-primary text-primary' : 'text-cream'}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="section-padding bg-cream-light" id="testimonials">
        <div className="section-container">
          <div className="h-12 w-96 bg-cream rounded-lg skeleton mx-auto mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-cream rounded-2xl skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-padding bg-cream-light" id="testimonials">
        <div className="section-container">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-section mb-2 text-left text-xl md:text-3xl"
          >
            Testimoni Pelanggan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-text-body mb-8 md:mb-12 text-left text-sm md:text-base"
          >
            Dengarkan cerita dari pelanggan kami yang telah merasakan manfaatnya
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-4"
          >
            {displayedTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                className="bg-cream rounded-2xl p-4 md:p-8 shadow-soft"
              >
                {/* Rating */}
                <div className="mb-3 md:mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Message */}
                <p className="text-text-body mb-4 md:mb-6 leading-relaxed italic text-xs md:text-sm">
                  "{testimonial.message}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3 md:gap-4">
                  {testimonial.avatarUrl ? (
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.customerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {testimonial.customerInitial || testimonial.customerName[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-text-dark">
                      {testimonial.customerName}
                    </p>
                    <p className="text-sm text-text-body">Pelanggan setia</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More / Show Less */}
          {testimonials.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-8"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
              >
                {showAll ? 'Sembunyikan' : `Lihat Selengkapnya (${testimonials.length - 3} lagi)`}
              </button>
            </motion.div>
          )}

          {/* Submit Testimonial Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12 pt-8 border-t border-primary/20"
          >
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300"
            >
              Tulis Testimoni Anda
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Form Modal */}
      {showForm && (
        <TestimonialForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            // Refresh testimonials
            fetch('/api/testimonials')
              .then((res) => res.json())
              .then((data) => setTestimonials(data));
          }}
        />
      )}
    </>
  );
}

interface TestimonialFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function TestimonialForm({ onClose, onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal mengirim testimoni');

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Terima Kasih!</h3>
          <p className="text-text-body">
            Testimoni Anda akan kami tinjau sebelum ditampilkan di website.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4"
      >
        <h3 className="text-2xl font-bold text-text-dark">Tulis Testimoni</h3>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerName: e.target.value }))
            }
            className="w-full px-4 py-2 border-2 border-cream rounded-lg focus:border-primary focus:outline-none"
            placeholder="Nama Anda"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, rating }))}
                className="transition-transform hover:scale-125"
              >
                <Star
                  size={28}
                  className={
                    rating <= formData.rating
                      ? 'fill-primary text-primary'
                      : 'text-cream'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Pesan
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            className="w-full px-4 py-2 border-2 border-cream rounded-lg focus:border-primary focus:outline-none resize-none"
            placeholder="Tuliskan pengalaman Anda..."
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
