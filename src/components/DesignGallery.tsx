"use client";

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ["All", "Botanical", "Fluted Louver", "Neo-Classical", "Temple Pichwai"];

const DESIGNS = [
  { id: 1, title: "Emerald Monstera", category: "Botanical", image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&q=80" },
  { id: 2, title: "Acoustic Walnut", category: "Fluted Louver", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
  { id: 3, title: "Versailles Gold", category: "Neo-Classical", image: "https://images.unsplash.com/photo-1595514535313-09419b4566c1?w=800&q=80" },
  { id: 4, title: "Lotus Pond Pichwai", category: "Temple Pichwai", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
];

export default function DesignGallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDesigns = activeCategory === "All"
    ? DESIGNS
    : DESIGNS.filter(d => d.category === activeCategory);

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#8A5836] font-bold uppercase tracking-wider text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            Curated Collections
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-['Syne'] text-[#1C130B]">
            Premium Finishes
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#1C130B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDesigns.map(design => (
          <div key={design.id} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <Image
              src={design.image}
              alt={design.title}
              fill
              className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/90 via-[#1C130B]/20 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1 block">
                {design.category}
              </span>
              <h3 className="text-white text-xl font-bold font-['Syne'] mb-3">
                {design.title}
              </h3>

              <button className="flex items-center gap-2 text-sm text-white font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Try in Room <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
