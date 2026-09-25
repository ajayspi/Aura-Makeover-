"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AuroBrand } from './AuroLogo';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Societies', href: '/#corridors' },
    { label: 'Process', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b -mb-[88px] ${
          isScrolled
            ? 'bg-[#FAF8F5]/85 backdrop-blur-md border-[#C5A880]/20 shadow-sm py-3 sm:py-4'
            : 'bg-transparent border-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="relative z-50">
            <AuroBrand />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8 bg-white/50 px-8 py-3 rounded-full border border-[#C5A880]/10 shadow-[0_4px_20px_rgba(197,168,128,0.05)]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#1C130B]/70 hover:text-[#1C130B] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/#estimator"
              className="bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-6 py-3 rounded-full font-bold font-['Plus_Jakarta_Sans'] text-sm tracking-wide transition-colors flex items-center gap-2 shadow-lg"
            >
              Book Swatch Van
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative z-50 p-2 text-[#1C130B] focus:outline-none bg-white/50 rounded-full border border-[#C5A880]/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            className="fixed inset-0 z-40 bg-[#FAF8F5] pt-28 px-6 pb-6 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-['Syne'] font-bold text-3xl text-[#1C130B]"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-[#C5A880]/20 w-12 mx-auto my-4" />
              
              <Link
                href="/#estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#1C130B] text-[#FAF8F5] px-8 py-5 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-lg tracking-wide shadow-xl flex items-center justify-center gap-2 mx-4"
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
