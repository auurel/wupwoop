'use client';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-0 sm:min-h-[620px] lg:min-h-[730px] flex items-start sm:items-center justify-center pt-12 sm:pt-0 pb-0 sm:pb-20 hero-batik"
      id="hero"
    >
      {/* Batik background applied via CSS (.hero-batik) */}
      <div className="w-[min(96vw,1600px)] mx-auto px-[clamp(12px,2vw,32px)]">
        <div className="flex flex-col items-center justify-center text-center w-full py-1 sm:py-0">
          {/* Main Heading */}
          <h1 className="text-[clamp(1.05rem,3.8vw,3rem)] sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-text-dark text-center text-balance mb-2 sm:mb-8 max-w-[88vw] sm:max-w-3xl font-flamante leading-[1.02] sm:leading-tight">
            Wujudkan Pakaian Impian Anda
          </h1>

          {/* Subheading */}
          <p className="text-[0.68rem] sm:text-lg md:text-xl text-text-body max-w-[88vw] sm:max-w-2xl leading-5 sm:leading-relaxed font-nunito text-center text-balance">
            Solusi jahit gamis, koko, dan seragam terpercaya. Pengerjaan tepat waktu dengan kualitas
            jahitan kelas atas yang membuat Anda tampil lebih percaya diri.
          </p>
        </div>
      </div>

    </section>
  );
}
