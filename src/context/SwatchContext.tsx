"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Swatch {
  id: string;
  name: string;
  frenchName: string;
  colorHex: string;
  category: 'wall' | 'stone' | 'blinds' | 'lighting' | 'hardware';
  pricePerSqFt: number;
  tagline: string;
  thumbnailUrl?: string;
}

interface SwatchContextType {
  swatches: Swatch[];
  addSwatch: (swatch: Swatch) => boolean;
  removeSwatch: (id: string) => void;
  clearSwatches: () => void;
  isFull: boolean;
  activeColor: string;
  setActiveColor: (hex: string) => void;
}

const DEFAULT_SWATCHES: Swatch[] = [
  {
    id: 'g05-stone',
    name: 'Green 05 - Stone',
    frenchName: 'Vert Kaki Sourde',
    colorHex: '#7D8471',
    category: 'wall',
    pricePerSqFt: 85,
    tagline: 'Velvet matte lacquer & fluted joinery',
    thumbnailUrl: '/images/fluted-louver.jpg',
  },
  {
    id: 'travertine-romano',
    name: 'Travertine Romano',
    frenchName: 'Travertin Romano Brut',
    colorHex: '#D7C4A5',
    category: 'stone',
    pricePerSqFt: 110,
    tagline: 'Honed limestone with warm amber veins',
    thumbnailUrl: '/images/after-pooja-marble.jpg',
  },
];

const SwatchContext = createContext<SwatchContextType | undefined>(undefined);

const STORAGE_KEY = 'auro_plum_swatch_tray_v1';

export function SwatchProvider({ children }: { children: ReactNode }) {
  const [swatches, setSwatches] = useState<Swatch[]>(DEFAULT_SWATCHES);
  const [activeColor, setActiveColor] = useState<string>('#7D8471'); // Green 05 Stone
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSwatches(parsed.slice(0, 3));
        }
      }
    } catch {
      // Fallback to default
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(swatches));
    } catch {
      // Quota exceeded / private mode
    }
  }, [swatches, isInitialized]);

  const addSwatch = (swatch: Swatch): boolean => {
    if (swatches.some((s) => s.id === swatch.id)) {
      return true; // Already in tray
    }
    if (swatches.length >= 3) {
      // FIFO eviction: replace the oldest swatch to allow seamless discovery
      setSwatches([swatches[1], swatches[2], swatch]);
      return true;
    }
    setSwatches([...swatches, swatch]);
    return true;
  };

  const removeSwatch = (id: string) => {
    setSwatches(swatches.filter((s) => s.id !== id));
  };

  const clearSwatches = () => {
    setSwatches([]);
  };

  return (
    <SwatchContext.Provider
      value={{
        swatches,
        addSwatch,
        removeSwatch,
        clearSwatches,
        isFull: swatches.length >= 3,
        activeColor,
        setActiveColor,
      }}
    >
      {children}
    </SwatchContext.Provider>
  );
}

export function useSwatch() {
  const context = useContext(SwatchContext);
  if (!context) {
    throw new Error('useSwatch must be used within a SwatchProvider');
  }
  return context;
}
