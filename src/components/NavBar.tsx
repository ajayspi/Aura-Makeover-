"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuroBrand } from './AuroLogo';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLightRoute = ['/comparator', '/smart-shading', '/visualizer', '/collections', '/quiz', '/rooms', '/locations', '/services'].some(p => pathname?.startsWith(p));
  const isNavDark = isScrolled || mobileMenuOpen || isLightRoute;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Rooms', href: '/rooms' },
    { label: '3D Studio', href: '/studio' },
    { label: 'Stone', href: '/collections/stone' },
    { label: 'Rental ROI', href: '/calculators/rental-yield' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b -mb-[88px] ${
          isNavDark
            ? 'bg-[#FAF8F5]/85 backdrop-blur-md border-[#C5A880]/20 shadow-sm py-3 sm:py-4'
            : 'bg-transparent border-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="relative z-50">
            <AuroBrand variant={isNavDark ? 'dark' : 'light'} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-6 bg-white/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#C5A880]/20 shadow-[0_4px_20px_rgba(197,168,128,0.08)]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-['Plus_Jakarta_Sans'] font-semibold text-xs tracking-wider uppercase text-[#1C130B]/80 hover:text-[#8A5836] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/my/dashboard"
                className="text-xs font-bold uppercase tracking-wider text-[#1C130B] hover:text-[#8A5836] bg-[#C5A880]/20 hover:bg-[#C5A880]/30 px-3.5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 font-['Plus_Jakarta_Sans']"
                title="Customer Dashboard"
              >
                <User className="w-3.5 h-3.5 text-[#8A5836]" />
                <span>My Portal</span>
              </Link>

              <Link
                href="/#estimator"
                className="bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-5 py-2.5 rounded-full font-bold font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
              >
                Book Swatch Van
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative z-50 p-2 text-[#1C130B] focus:outline-none bg-white/70 rounded-full border border-[#C5A880]/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-[#FAF8F5] pt-28 px-6 pb-8 flex flex-col lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-5 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-['Syne'] font-bold text-2xl text-[#1C130B] hover:text-[#8A5836] transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-[#C5A880]/20 w-16 mx-auto my-2" />

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
                <Link
                  href="/my/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-2xl border border-[#C5A880]/30 text-xs font-bold uppercase tracking-wider text-[#1C130B] font-['Plus_Jakarta_Sans']"
                >
                  Client Portal
                </Link>
                <Link
                  href="/ops"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-2xl border border-[#C5A880]/30 text-xs font-bold uppercase tracking-wider text-[#1C130B] font-['Plus_Jakarta_Sans']"
                >
                  Ops Command
                </Link>
              </div>

              <div className="h-px bg-[#C5A880]/20 w-16 mx-auto my-2" />
              
              <Link
                href="/#estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#1C130B] text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-base tracking-wide shadow-xl flex items-center justify-center gap-2 mx-4"
              >
                Book Swatch Van
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
