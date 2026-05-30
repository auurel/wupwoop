"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { fetchJSONWithTimeout } from "@/lib/utils";

interface Testimonial {
  id: string;
  customerName: string;
  customerInitial?: string;
  avatarUrl?: string;
  rating: number;
  message: string;
  isApproved: boolean;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-testimonial-1",
    customerName: "bolu ketan",
    customerInitial: "B",
    avatarUrl: undefined,
    rating: 1,
    message:
      "ADMIN 1 aka OREL SCAM, GA BISA PESAN PESAWAT TEMPUR !!!!!! KECEWA tapi webnya bagus",
    isApproved: true,
  },
  {
    id: "fallback-testimonial-2",
    customerName: "aurel",
    customerInitial: "A",
    avatarUrl: undefined,
    rating: 1,
    message: "wow bgt wowowowow",
    isApproved: true,
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await fetchJSONWithTimeout<Testimonial[]>("/api/testimonials", {
          timeoutMs: 7000,
          fallback: [],
        });
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setTestimonials(fallbackTestimonials);
      }
    };

    fetchTestimonials();
  }, []);

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < rating ? "fill-primary text-primary" : "text-cream"} />
      ))}
    </div>
  );

  return (
    <>
      <section className="section-padding bg-cream-light" id="testimonials">
        <div className="section-container">
          <h2 className="heading-section mb-4 text-left">Testimoni Pelanggan</h2>

          <p className="text-text-body mb-12 text-left">Dengarkan cerita dari pelanggan kami yang telah merasakan manfaatnya</p>

          {displayedTestimonials.length > 0 ? (
            <div className="space-y-4">
              {displayedTestimonials.map((t) => (
                <article key={t.id} className="bg-cream rounded-2xl p-6 md:p-8 shadow-soft">
                  <div className="mb-4">
                    <StarRating rating={t.rating} />
                  </div>

                  <p className="text-text-body mb-6 leading-relaxed italic">"{t.message}"</p>

                  <div className="flex items-center gap-4">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.customerName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                        {t.customerInitial || t.customerName[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-text-dark">{t.customerName}</p>
                      <p className="text-sm text-text-body">Pelanggan setia</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-cream p-5 text-center text-text-body">Belum ada testimoni yang dapat ditampilkan saat ini.</div>
          )}

          {testimonials.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
              >
                {showAll ? "Sembunyikan" : `Lihat Selengkapnya (${testimonials.length - 3} lagi)`}
              </button>
            </div>
          )}

          <div className="text-center mt-12 pt-8 border-t border-primary/20">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300"
            >
              Tulis Testimoni Anda
            </button>
          </div>
        </div>
      </section>

      {showForm && <TestimonialForm onClose={() => setShowForm(false)} onSuccess={() => void fetch('/api/testimonials').then((r) => r.json()).then((d) => setTestimonials(d))} />}
    </>
  );
}

interface TestimonialFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function TestimonialForm({ onClose, onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState({ customerName: '', rating: 5, message: '' });
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
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Terima Kasih!</h3>
          <p className="text-text-body">Testimoni Anda akan kami tinjau sebelum ditampilkan di website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4">
        <h3 className="text-2xl font-bold text-text-dark">Tulis Testimoni</h3>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Nama Lengkap</label>
          <input type="text" required value={formData.customerName} onChange={(e) => setFormData((p) => ({ ...p, customerName: e.target.value }))} className="w-full px-4 py-2 border-2 border-cream rounded-lg focus:border-primary focus:outline-none" placeholder="Nama Anda" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => setFormData((p) => ({ ...p, rating: r }))} className="transition-transform hover:scale-125">
                <Star size={28} className={r <= formData.rating ? 'fill-primary text-primary' : 'text-cream'} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Pesan</label>
          <textarea required value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} className="w-full px-4 py-2 border-2 border-cream rounded-lg focus:border-primary focus:outline-none resize-none" placeholder="Tuliskan pengalaman Anda..." rows={4} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-cream transition-colors">Batal</button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">{loading ? 'Mengirim...' : 'Kirim'}</button>
        </div>
      </form>
    </div>
  );
}
              <label className="block text-sm font-semibold text-text-dark mb-2">Pesan</label>
