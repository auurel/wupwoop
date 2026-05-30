'use client';

// Animations removed: no fade-in/fade-out effects

export default function AboutSection() {
  return (
    <section className="relative bg-wave-full pt-0 pb-2 sm:py-14 md:py-24 lg:py-32" id="about-us">
      <div className="w-[min(96vw,1600px)] mx-auto px-[clamp(12px,2vw,32px)]">
        <div className="flex flex-col gap-0 md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center">
          {/* Image */}
          <div className="flex items-center justify-center md:justify-center order-1 md:order-none mt-0 sm:mt-0">
            <div className="relative w-full max-w-[190px] sm:max-w-md md:max-w-md lg:max-w-lg z-0 -translate-y-8 sm:translate-y-0">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/images/Group 57.svg"
                  alt="Muzayyan - Jahit Custom"
                  width={1100}
                  height={720}
                  className="w-full h-auto object-contain scale-[1.02] sm:scale-100"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="about-text-panel -mt-1 sm:mt-0 -translate-y-3 sm:translate-y-0 space-y-3 sm:space-y-6 relative z-10 order-2 md:order-none">
            <h2 className="text-[0.95rem] sm:text-3xl md:text-4xl font-bold text-[#562F00] leading-tight">
              Muzayyan
            </h2>

            <div className="space-y-1.5 sm:space-y-4 text-justify leading-[1.28] sm:leading-relaxed text-[#562F00] text-[0.58rem] sm:text-base [font-family:'Poppins',sans-serif]">
              <p className="hyphens-auto">
                Muzayyan merupakan layanan jasa jahit dan penjualan produk ready to wear yang
                berdiri sejak 1 maret 2017. Muzayyan menerima jasa jahit costum, seragam dan
                makloon dengan kebijakan masing-masing harga sesuai kategori. Selain itu muzayyan
                juga menyediakan produk ready to wear seperti gamis, tunik, dailly wear.
              </p>

              <p className="hyphens-auto">
                Muzayyan mulai menerapkan sustainable fashion dimulai dari memanfaatkan perca kain
                untuk membuat souvenir seperti ganci, lanyard, tempat tisu, tempat pensil, tas
                serut dll
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
