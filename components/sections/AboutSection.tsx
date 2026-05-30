'use client';

// Animations removed: no fade-in/fade-out effects

export default function AboutSection() {
  return (
    <section
      className="relative bg-wave-full py-8 md:py-24 lg:py-32"
      id="about-us"
    >
      <div className="w-[min(96vw,1600px)] mx-auto px-[clamp(12px,2vw,32px)]">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 lg:gap-16 items-center"
        >
          {/* Image */}
          <div className="flex justify-center">
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
          </div>

          {/* Content */}
          <div className="space-y-4 md:space-y-6 relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-[#562F00]">Muzayyan</h2>

            <div className="space-y-3 md:space-y-4 text-left md:text-justify leading-relaxed text-[#562F00] text-sm md:text-base [font-family:'Poppins',sans-serif]">
              <p>
                Muzayyan merupakan layanan jasa jahit dan penjualan produk ready to wear yang
                berdiri sejak 1 maret 2017. Muzayyan menerima jasa jahit costum, seragam dan
                makloon dengan kebijakan masing-masing harga sesuai kategori. Selain itu muzayyan
                juga menyediakan produk ready to wear seperti gamis, tunik, dailly wear.
              </p>

              <p>
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
