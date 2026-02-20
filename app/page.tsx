"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Shield, Zap, Navigation } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Fullscreen Stagger
      gsap.fromTo(
        ".hero-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      // Hero Image Parallax & Scale
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 30, // move down as we scroll down (creates depth)
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Intersection Observer for the rest of the elements
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      gsap.utils.toArray(".scroll-reveal").forEach((el: any) => {
        gsap.set(el, { y: 40, opacity: 0 });
        observer.observe(el);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#fcfcfc] overflow-hidden selection:bg-yellow-200 selection:text-gray-900"
    >
      {/* --- FULL SCREEN IMMERSIVE HERO --- */}
      <section className="hero-section relative h-screen min-h-[700px] flex items-center overflow-hidden bg-[#050505]">
        {/* Background Image with Parallax */}
        <div
          ref={heroImgRef}
          className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 origin-center will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=100"
            alt="Cinematic Premium Motorcycle"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
        </div>

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-10"></div>
        <div className="absolute inset-0 bg-[#050505]/20 z-10 mix-blend-multiply"></div>

        {/* Content */}
        <div className="mx-auto px-6 md:px-12 max-w-[1300px] w-full relative z-20 mt-16 md:mt-24">
          <div className="max-w-4xl">
            <h1 className="hero-reveal text-[3.5rem] leading-[1] md:text-[6rem] lg:text-[7.5rem] font-bold text-[#fafafa] tracking-tighter mb-6 lg:mb-8">
              Jelajahi
              <br />
              Tanpa Batas.
            </h1>
            <p className="hero-reveal text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-lg mb-12">
              Standar mobilitas premium. Rasakan kebebasan berkendara dengan
              armada eksklusif di setiap sudut kota.
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row gap-6">
              <Link
                href="/motorcycles"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 hover:scale-[1.03] transition-all duration-500 rounded-none tracking-widest uppercase"
              >
                Mulai Eksplorasi
                <ArrowRight size={16} />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-10 py-5 text-sm font-medium text-white border border-white/20 bg-black/20 hover:bg-white/10 hover:border-white/50 backdrop-blur-md transition-all duration-500 rounded-none tracking-widest uppercase"
              >
                Filosofi Kami
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-70">
          <span className="text-[9px] text-white tracking-[0.4em] uppercase font-semibold">
            Scroll
          </span>
          <div className="w-px h-16 bg-white/20 relative overflow-hidden">
            {/* Note: animation should ideally be put in globals.css, but inline style here for simplicity if needed or we use a custom tailwind class. Let's use gsap or basic inline css */}
            <div className="w-full h-1/2 bg-white absolute top-0 left-0 animate-[scrollDown_2s_ease-in-out_infinite]">
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes scrollDown {
                        0% { top: -50%; opacity: 0; }
                        50% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                 `,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- EDITORIAL ABOUT SECTION --- */}
      <section
        id="about"
        className="py-24 md:py-32 bg-white border-b border-gray-100 relative z-30"
      >
        <div className="mx-auto px-6 md:px-12 max-w-[1100px]">
          <div className="grid md:grid-cols-12 gap-12 md:gap-24 items-start">
            <div className="md:col-span-5 scroll-reveal">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter leading-tight mb-6 mt-1">
                Lebih dari
                <br />
                sekadar rental.
              </h2>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                Tentang Jogja Rentalan
              </p>
            </div>

            <div className="md:col-span-7 space-y-8 scroll-reveal pt-2">
              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
                Jogja Rentalan lahir dari dedikasi untuk merestrukturisasi cara
                orang menjelajahi Yogyakarta. Kami membuang proses rumit dan
                antrean panjang.
              </p>
              <p className="text-[15px] text-gray-500 font-light leading-loose">
                Alih-alih menyewakan kendaraan secara serampangan, kami merawat
                setiap unit seperti milik kami sendiri. Setiap motor melewati
                proses inspeksi ketat 12 titik sebelum diserahkan kepada Anda.
                Desain layanan kami fokus pada tiga hal krusial: keamanan
                absolut, kemudahan akses digital, dan estetika perjalanan.
                Karena kami percaya, perjalanan yang luar biasa dimulai dari
                kendaraan yang tepat.
              </p>
              <div className="pt-8 flex flex-wrap gap-12 border-t border-gray-100">
                <div>
                  <h4 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tighter mb-3">
                    98%
                  </h4>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">
                    Tingkat Kepuasan
                  </p>
                </div>
                <div>
                  <h4 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tighter mb-3">
                    24/7
                  </h4>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">
                    Dukungan Darurat
                  </p>
                </div>
                <div>
                  <h4 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tighter mb-3">
                    100+
                  </h4>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">
                    Armada Premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINIMALIST VALUES --- */}
      <section className="py-24 md:py-32 bg-[#fafafa] relative z-30">
        <div className="mx-auto px-6 md:px-12 max-w-[1200px]">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
            <div className="scroll-reveal group">
              <div className="mb-8">
                <div className="w-12 h-12 flex items-center justify-start text-gray-900">
                  <Shield strokeWidth={1} size={36} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
                Proteksi Komprehensif
              </h3>
              <p className="text-[15px] text-gray-500 font-light leading-relaxed">
                Keselamatan bukan opsi, melainkan standar. Asuransi menyeluruh
                pada setiap armada dan layanan darurat di jalan memastikan
                pikiran tenang setiap saat.
              </p>
            </div>

            <div className="scroll-reveal group">
              <div className="mb-8">
                <div className="w-12 h-12 flex items-center justify-start text-gray-900">
                  <Zap strokeWidth={1} size={36} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
                Instan & Digital
              </h3>
              <p className="text-[15px] text-gray-500 font-light leading-relaxed">
                Reservasi dan konfirmasi dalam hitungan detik. Tanpa kertas,
                tanpa proses birokrasi berbelit. Semuanya diakses dan dikelola
                dalam genggaman Anda.
              </p>
            </div>

            <div className="scroll-reveal group">
              <div className="mb-8">
                <div className="w-12 h-12 flex items-center justify-start text-gray-900">
                  <Navigation strokeWidth={1} size={36} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
                Mobilitas Fleksibel
              </h3>
              <p className="text-[15px] text-gray-500 font-light leading-relaxed">
                Ambil dan kembalikan di titik strategis sepanjang kota. Layanan
                mobilitas eksklusif yang menyesuaikan diri dengan jadwal dan
                rute Anda, bukan sebaliknya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EDITORIAL CTA --- */}
      <section className="py-32 lg:py-48 bg-[#050505] text-[#fafafa] relative z-30">
        <div className="mx-auto px-6 md:px-12 max-w-[800px] text-center scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tighter leading-tight">
            Kendalikan
            <br />
            Perjalanan Anda.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-light mb-12">
            Lupakan proses sewa tradisional. Pindah ke standar mobilitas yang
            sepadan dengan ekspektasi Anda.
          </p>
          <Link
            href="/motorcycles"
            className="inline-flex items-center justify-center px-10 py-5 text-sm font-semibold text-[#050505] bg-white hover:bg-gray-200 hover:scale-[1.03] transition-all duration-500 rounded-none tracking-widest uppercase"
          >
            Mulai Penyewaan
          </Link>
        </div>
      </section>
    </div>
  );
}
