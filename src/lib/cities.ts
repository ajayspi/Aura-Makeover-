export interface CityConfig {
  slug: string;
  name: string;
  state: string;
  region: string;
  hero: {
    eyebrow: string;
    headline: string;
    subtext: string;
    statPills: string[];
  };
  societies: Array<{
    id: string;
    name: string;
    flatsDone: number;
    unitTypes: string[];
    priceRange: string;
  }>;
  serviceAreas: string[];
  whatsappNumber: string;
  meta: {
    title: string;
    description: string;
  };
}

export const CITIES: Record<string, CityConfig> = {
  hyderabad: {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    region: 'West Corridor',
    hero: {
      eyebrow: 'Now serving Hyderabad West',
      headline: 'Premium Home Makeovers in 48 Hours.',
      subtext: 'Wallpapers, acoustic louvers & smart blinds — installed with zero civil work and zero dust.',
      statPills: ['247 Flats Done', '4.9★ Rating', '48hr Guarantee'],
    },
    societies: [
      { id: 'bhooja', name: 'My Home Bhooja', flatsDone: 47, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. ₹38,000–₹52,000' },
      { id: 'sarovar', name: 'Aparna Sarovar Zenith', flatsDone: 62, unitTypes: ['3BHK'], priceRange: 'Est. ₹42,000–₹58,000' },
      { id: 'provincia', name: 'Rajapushpa Provincia', flatsDone: 38, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. ₹45,000–₹62,000' },
      { id: 'prestige', name: 'Prestige High Fields', flatsDone: 54, unitTypes: ['3BHK'], priceRange: 'Est. ₹40,000–₹55,000' },

      { id: 'avatar', name: 'My Home Avatar', flatsDone: 41, unitTypes: ['2BHK', '3BHK'], priceRange: 'Est. 35,000-48,000' },
      { id: 'tarkshya', name: 'My Home Tarkshya', flatsDone: 29, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. 42,000-60,000' },
      { id: 'mangala', name: 'My Home Mangala', flatsDone: 22, unitTypes: ['3BHK'], priceRange: 'Est. 38,000-55,000' },
      { id: 'cyberlife', name: 'Aparna CyberLife', flatsDone: 33, unitTypes: ['3BHK'], priceRange: 'Est. 40,000-52,000' },
      { id: 'atria', name: 'Rajapushpa Atria', flatsDone: 45, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. 43,000-58,000' },
      { id: 'lanco', name: 'Lanco Hills', flatsDone: 76, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. 45,000-65,000' },
      { id: 'silicon', name: 'Jayabheri Silicon County', flatsDone: 51, unitTypes: ['3BHK'], priceRange: 'Est. 40,000-55,000' },
      { id: 'tranquil', name: 'Prestige Tranquil', flatsDone: 19, unitTypes: ['3BHK'], priceRange: 'Est. 42,000-58,000' },
      { id: 'beverly', name: 'Prestige Beverly Hills', flatsDone: 14, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. 48,000-68,000' },

    ],
    serviceAreas: ['Kokapet', 'Tellapur', 'Financial District', 'Nallagandla', 'Gachibowli'],
    whatsappNumber: '919700675637',
    meta: {
      title: 'AuroMakeover Hyderabad — Premium Home Makeovers in 48 Hours',
      description: 'Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Serving Kokapet, Tellapur, Financial District & West Corridor. Zero civil work. Book free swatch van visit.',
    },
  },
  bangalore: {
    slug: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    region: 'Whitefield & Sarjapur',
    hero: {
      eyebrow: 'Now serving Bangalore East',
      headline: 'Premium Home Makeovers in 48 Hours.',
      subtext: 'Designer wallpapers, acoustic panels & motorized blinds — installed in one weekend. Zero dust, zero hassle.',
      statPills: ['189 Flats Done', '4.8★ Rating', '48hr Guarantee'],
    },
    societies: [
      { id: 'prestige-blr', name: 'Prestige Lakeside Habitat', flatsDone: 31, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. ₹42,000–₹60,000' },
      { id: 'brigade', name: 'Brigade Metropolis', flatsDone: 42, unitTypes: ['3BHK'], priceRange: 'Est. ₹38,000–₹55,000' },
      { id: 'salarpuria', name: 'Salarpuria Sattva Greenage', flatsDone: 28, unitTypes: ['2BHK', '3BHK'], priceRange: 'Est. ₹35,000–₹48,000' },
      { id: 'shriram', name: 'Shriram Properties', flatsDone: 35, unitTypes: ['3BHK'], priceRange: 'Est. ₹40,000–₹58,000' },
    ],
    serviceAreas: ['Whitefield', 'Sarjapur Road', 'Marathahalli', 'Bellandur', 'Electronic City'],
    whatsappNumber: '919700675637',
    meta: {
      title: 'AuroMakeover Bangalore — Premium Home Makeovers in 48 Hours',
      description: 'Luxury home makeovers in Bangalore Whitefield & Sarjapur. 48-hour installation, zero civil work. Designer wallpapers, acoustic louvers, smart blinds. Book free swatch van.',
    },
  },
  chennai: {
    slug: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'OMR & GST Road',
    hero: {
      eyebrow: 'Now serving Chennai South',
      headline: 'Premium Home Makeovers in 48 Hours.',
      subtext: 'Heritage mouldings, botanical wallpapers & smart blinds — installed in 48 hours. Zero civil work.',
      statPills: ['156 Flats Done', '4.7★ Rating', '48hr Guarantee'],
    },
    societies: [
      { id: 'casagrand', name: 'Casagrand Luxus', flatsDone: 22, unitTypes: ['3BHK', '4BHK'], priceRange: 'Est. ₹36,000–₹52,000' },
      { id: 'tvh', name: 'TVH Ouranya Bay', flatsDone: 18, unitTypes: ['3BHK'], priceRange: 'Est. ₹40,000–₹58,000' },
      { id: 'radiance', name: 'Radiance Mercury', flatsDone: 25, unitTypes: ['3BHK'], priceRange: 'Est. ₹38,000–₹54,000' },
      { id: 'godrej', name: 'Godrej Azure', flatsDone: 30, unitTypes: ['2BHK', '3BHK'], priceRange: 'Est. ₹34,000–₹48,000' },
    ],
    serviceAreas: ['OMR', 'GST Road', 'Perungudi', 'Thoraipakkam', 'Sholinganallur'],
    whatsappNumber: '919700675637',
    meta: {
      title: 'AuroMakeover Chennai — Premium Home Makeovers in 48 Hours',
      description: 'Chennai\'s fastest home makeover service. OMR & GST Road coverage. Luxury wallpapers, fluted louvers, smart blinds in 48 hours. Zero civil work. Book now.',
    },
  },
};

export function getCity(slug: string): CityConfig | undefined {
  return CITIES[slug.toLowerCase()];
}

export function getAllCitySlugs(): string[] {
  return Object.keys(CITIES);
}

export function getDefaultCity(): CityConfig {
  return CITIES.hyderabad;
}
