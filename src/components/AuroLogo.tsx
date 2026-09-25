import React from 'react';

interface AuroLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function AuroLogo({ className = "w-8 h-8", variant = 'dark' }: AuroLogoProps) {
  const primaryColor = variant === 'dark' ? '#1C130B' : '#FAF8F5';
  const secondaryColor = '#C5A880';
  const accentColor = '#8A5836';

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background geometric arch (architectural reference) */}
      <path 
        d="M 25 80 V 45 C 25 30 35 20 50 20 C 65 20 75 30 75 45 V 80" 
        stroke={secondaryColor} 
        strokeWidth="6" 
        strokeLinecap="round"
        opacity="0.4"
      />
      
      {/* The letter 'A' - Sharp and architectural */}
      <path 
        d="M 50 15 L 20 85 M 50 15 L 80 85" 
        stroke={primaryColor} 
        strokeWidth="8" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* The crossbar of the 'A' designed as an 'M' dip */}
      <path 
        d="M 32 60 L 50 45 L 68 60" 
        stroke={accentColor} 
        strokeWidth="8" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Decorative dot - representing precision/focus */}
      <circle cx="50" cy="35" r="4" fill={secondaryColor} />
    </svg>
  );
}

export function AuroBrand({ className = "", variant = 'dark' }: { className?: string, variant?: 'dark' | 'light' }) {
  const textColor = variant === 'dark' ? 'text-[#1C130B]' : 'text-[#FAF8F5]';
  const highlightColor = variant === 'dark' ? 'text-[#8A5836]' : 'text-[#C5A880]';

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
        <AuroLogo className="w-8 h-8 sm:w-10 sm:h-10" variant={variant} />
      </div>
      <span className={`font-['Syne'] font-black text-xl sm:text-2xl tracking-tight ${textColor}`}>
        Auro<span className={highlightColor}>Makeover</span>
      </span>
    </div>
  );
}
