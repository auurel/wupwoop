'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScroll(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Layanan', href: '#services' },
    { label: 'Produk', href: '#products' },
    { label: 'Testimoni', href: '#testimonials' },
    { label: 'Tentang Kami', href: '#about-us' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    const id = href.replace('#', '');
    const element = document.getElementById(id);

    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="fixed top-2 md:top-4 left-0 right-0 z-50">
      <div className="w-[min(96vw,1600px)] mx-auto px-[clamp(12px,2vw,32px)]">
        <div
          className={cn(
            'flex items-center justify-between h-[clamp(44px,5.2vw,56px)] rounded-full px-[clamp(12px,2vw,24px)] transition-all duration-300',
            'backdrop-blur-xl bg-[rgba(250,215,113,0.16)] border border-[rgba(255,255,255,0.35)]',
            hasScroll && 'bg-[rgba(250,215,113,0.20)] shadow-lg'
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.svg"
              alt="Muzayyan Logo"
              className="h-[clamp(22px,3vw,32px)] w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-[clamp(18px,2.4vw,34px)]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="whitespace-nowrap text-[clamp(15px,1.3vw,18px)] font-medium [font-family:'Poppins',sans-serif] text-[#562F00] hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 p-3 space-y-3 rounded-2xl backdrop-blur-xl bg-[rgba(250,215,113,0.16)] border border-[rgba(255,255,255,0.35)] shadow-lg">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-4 py-2 font-medium [font-family:'Poppins',sans-serif] text-[#562F00] hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
