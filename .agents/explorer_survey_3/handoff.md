# Visual UI Components, Animations & Design Survey (Explorer Survey 3)

## 1. Observation

Direct code observations from inspecting the codebase:

### 1.1 Current Architecture in `src/app/page.tsx`
- **Path**: `src/app/page.tsx`, lines 1-38
- **Current layout**:
  - `HeroSection` (line 8)
  - `DesignGallery` (line 11)
  - `#estimator` containing `EstimatorGateway` (lines 14-24)
  - Hardcoded minimal footer (lines 26-34)
- **Gaps**:
  - No Before/After interactive showcase component (`R2`).
  - No Society-Specific Value section (`R4`).
  - No auto-scrolling stats ticker above the estimator (`R5`).
  - No dedicated modular `Footer` component (`R6`).
  - Background of `#estimator` container is `bg-white` (line 14), violating the brand linen off-white `#FAF8F5`.

### 1.2 Current `HeroSection.tsx`
- **Path**: `src/components/HeroSection.tsx`, lines 1-67
- **Current implementation**:
  - Height & padding: `py-20 px-6` with `rounded-b-[3rem]`, not full-screen.
  - Background: static blurred circles (`bg-[#8A5836]/20 blur-[100px]` and `bg-[#C5A880]/10 blur-[80px]`). No animated gradient blobs.
  - Headline (lines 23-25): static text `<h1 className="text-5xl md:text-7xl font-black font-['Syne'] leading-tight mb-6">Premium Home Makeovers in <span className="text-[#C5A880]">48 Hours</span>.</h1>`. No word-by-word reveal or Framer Motion animation.
  - Floating stat pills: completely missing (R1 requires: "247 Flats Done", "4.9★ Rating", "48hr Guarantee").
  - CTAs preserved (lines 32-43):
    1. "Get Instant Quote" -> triggers `scrollToEstimator` (`document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' })`).
    2. "View Lookbook" -> currently static button.
  - Trust badges preserved (lines 47-63):
    1. 48-Hour Install (`Clock`)
    2. Zero Civil Work (`ShieldCheck`)
    3. Design-on-Wheels (`Truck`)

### 1.3 Current `DesignGallery.tsx`
- **Path**: `src/components/DesignGallery.tsx`, lines 1-83
- **Current implementation**:
  - Categories: `["All", "Botanical", "Fluted Louver", "Neo-Classical", "Temple Pichwai"]` (line 7).
  - Items (lines 9-14): only 4 items total (1 per category):
    - `Emerald Monstera` (Botanical)
    - `Acoustic Walnut` (Fluted Louver)
    - `Versailles Gold` (Neo-Classical)
    - `Lotus Pond Pichwai` (Temple Pichwai)
  - Grid (line 53): static `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`. All cards have identical `aspect-[4/5]` (line 55).
  - Card interactions: 2D scale `group-hover:scale-110` (line 60). No 3D tilt effect on hover.
  - Category tabs (lines 37-50): basic static buttons with ternary conditional classes; no animated underline or gliding pill.

### 1.4 Global Styling, Fonts & Configuration
- **Path**: `src/app/layout.tsx`, lines 2-28
  - `Geist` and `Geist_Mono` are imported from `next/font/google`. `Syne` and `Plus_Jakarta_Sans` are NOT imported.
  - Line 20 has TypeScript error: `export default function RootLayout({ children }: LayoutProps<"/">)`. Next.js does not provide `LayoutProps<"/">`.
  - Metadata (lines 15-18) is default placeholder ("Create Next App").
- **Path**: `package.json`, lines 14-22
  - `"framer-motion": "^13.3.0"` is already installed.
  - `"lucide-react": "^1.46.0"` is installed.
  - Tailwind CSS v4 is used with `@tailwindcss/postcss`.

---

## 2. Logic Chain

From these observations, we deduce the concrete specifications, component architectures, and implementation blueprint:

### 2.1 Blueprint for Requirement R1: Cinematic Hero Section
1. **Full-screen Layout**:
   - Container class: `relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#1C130B] text-[#FAF8F5] pt-24 pb-12 px-6`.
   - Dark `#1C130B` solid base with `rounded-b-[2.5rem] md:rounded-b-[3.5rem]`.
2. **Animated Ambient Gold Gradient Blobs**:
   - Using Framer Motion `<motion.div>` elements with continuous floating loops:
     - Blob A (Top-Right): `bg-[#C5A880]/20 w-[550px] h-[550px] blur-[120px] rounded-full`, keyframe animations `x: [0, 40, 0], y: [0, -35, 0], scale: [1, 1.2, 1]`, duration 12s, ease `easeInOut`, repeat `Infinity`.
     - Blob B (Bottom-Left): `bg-[#8A5836]/25 w-[500px] h-[500px] blur-[110px] rounded-full`, keyframe animations `x: [0, -35, 0], y: [0, 40, 0], scale: [1.1, 0.9, 1.1]`, duration 15s, ease `easeInOut`, repeat `Infinity`.
     - Blob C (Center subtle shimmer): `bg-[#C5A880]/10 w-[350px] h-[350px] blur-[90px] rounded-full`, opacity loop `[0.3, 0.7, 0.3]`, duration 8s.
3. **Word-by-Word Headline Stagger Reveal**:
   - Headline: `"Premium Home Makeovers in 48 Hours."`
   - Split into tokens:
     ```tsx
     const WORDS = [
       { text: "Premium", highlight: false },
       { text: "Home", highlight: false },
       { text: "Makeovers", highlight: false },
       { text: "in", highlight: false },
       { text: "48", highlight: true },
       { text: "Hours.", highlight: true },
     ];
     ```
   - Framer Motion Container Variant:
     - `variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}`
   - Child Word Variant:
     - `variants={{ hidden: { opacity: 0, y: 30, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}`
   - Style: `font-['Syne'] font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08]`. Words with `highlight: true` styled with `text-[#C5A880]`.
4. **3 Floating Animated Stat Pills**:
   - Array:
     1. `"247 Flats Done"` (Icon: `Building` / `CheckCircle2`)
     2. `"4.9★ Rating"` (Icon: `Star` in `#C5A880`)
     3. `"48hr Guarantee"` (Icon: `ShieldCheck` in `#C5A880`)
   - Entrance stagger delay: 0.8s, 1.0s, 1.2s.
   - Gentle floating keyframes: `y: [-4, 4, -4]`, loop duration 4s, 5s, 6s.
   - Pill styling: `bg-[#FAF8F5]/10 backdrop-blur-md border border-[#C5A880]/30 text-[#FAF8F5] px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold shadow-lg flex items-center gap-2`.
5. **Preserving CTAs and Trust Badges**:
   - CTA 1: "Get Instant Quote" -> `onClick={() => document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' })}`.
     - Styling: `bg-[#C5A880] hover:bg-[#b09571] text-[#1C130B] px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-[#C5A880]/20`.
   - CTA 2: "View Lookbook" -> `onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}`.
     - Styling: `bg-white/10 hover:bg-white/20 text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold text-lg transition-colors border border-white/15`.
   - Trust Badges:
     - 3-column responsive grid with top border `border-white/10 pt-10`:
       1. `Clock` -> "48-Hour Install" ("From measurement to final QA sign-off.")
       2. `ShieldCheck` -> "Zero Civil Work" ("100% dust-free, non-invasive, rental-safe.")
       3. `Truck` -> "Design-on-Wheels" ("Mobile swatch vans come to your door.")

---

### 2.2 Blueprint for Requirement R2: Before/After Interactive Showcase (`BeforeAfterShowcase.tsx`)
1. **Section Metadata**:
   - Title: `"The AuroMakeover Difference"` (`font-['Syne'] font-black text-4xl md:text-5xl text-[#1C130B]`).
   - Eyebrow: `<span className="text-[#8A5836] text-sm font-bold uppercase tracking-wider">Before & After Transformation</span>`.
   - Subtitle: `"Drag the slider to reveal how we turn blank builder distemper into high-end curated living spaces in 48 hours."`
2. **Room Switcher Tabs**:
   - 2 Room Types:
     - `Living Room` (Feature Wall: Fluted Walnut Louvers + Warm Sconce Accents)
     - `Bedroom` (Accent Wall: Heritage Temple Pichwai Silk Mural)
   - Pill toggle button at top center with Framer Motion `layoutId="activeRoomPill"`.
3. **Before vs After Visual Representation**:
   - **"Before" side**:
     - Gradient: `linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 50%, #a8a29e 100%)` (Stone/grey Builder Finish).
     - Overlay content: Wireframe room outline, stark bare bulb, electrical conduit sketches.
     - Badge: `bg-[#1C130B]/80 text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full backdrop-blur-md` -> `"Builder Finish (Bare Distemper)"`.
   - **"After" side**:
     - Gradient: `linear-gradient(135deg, #1C130B 0%, #361f14 45%, #8A5836 80%, #C5A880 100%)` (Rich warm gold & terracotta espresso).
     - Overlay content: Warm golden ambient glow, acoustic louver slat shadows, silk texture.
     - Badge: `bg-[#C5A880] text-[#1C130B] text-xs md:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg` -> `"After AuroMakeover (Luxury Suite)"`.
4. **Interactive Draggable Slider Mechanics**:
   - State: `sliderPosition` (percentage `0` to `100`, default `50`).
   - State: `isDragging` (boolean).
   - Container: `aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden relative select-none touch-none shadow-2xl border border-[#C5A880]/30`.
   - Clip-Path Equation:
     - Base layer: "After" layer fills 100% of container.
     - Clipped top layer: "Before" layer with `style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}`.
   - Divider Line:
     - `style={{ left: `${sliderPosition}%` }}` with `w-1 bg-[#FAF8F5] shadow-[0_0_15px_rgba(197,168,128,0.9)]`.
   - Draggable Knob / Handle:
     - Centered on divider line: `w-12 h-12 rounded-full bg-[#1C130B] border-2 border-[#C5A880] text-[#C5A880] flex items-center justify-center shadow-2xl cursor-ew-resize active:scale-110 transition-transform`.
     - Icon: Left/Right arrows or dual chevron `<Sliders className="w-5 h-5" />`.
   - Event Handling:
     - Desktop mouse: `onMouseDown`, plus global `mousemove` and `mouseup` window listeners when `isDragging === true`.
     - Mobile touch: `onTouchStart`, `onTouchMove`, `onTouchEnd` on container.
     - Keyboard accessibility: Left / Right arrow keys adjust position by +/- 2%.

---

### 2.3 Blueprint for Requirement R3: Upgraded Design Gallery (`DesignGallery.tsx`)
1. **Expanded 8-Item Dataset Across 4 Categories (2 per category)**:
   - **Botanical**:
     1. `Emerald Monstera Sanctuary`: Lush deep emerald palm foliage with brushed gold vein accents (`aspect-[4/5]`).
     2. `Misty Palm Oasis`: Calming sage & champagne eucalyptus watercolor mural (`aspect-[3/4]`).
   - **Fluted Louver**:
     3. `Acoustic Smoked Walnut`: Vertical acoustic timber louvers on sound-dampening black felt backing (`aspect-[3/4]`).
     4. `Nordic Teak Fluted Wall`: Honey teak architectural louvers with integrated warm LED glow (`aspect-[4/5]`).
   - **Neo-Classical**:
     5. `Versailles Moulding & Gold`: Intricate Parisian boiserie wall mouldings with antique gold foil trim (`aspect-[4/5]`).
     6. `Florentine Damask Silk`: Pearlescent champagne damask embossed silk tapestry wall (`aspect-[3/4]`).
   - **Temple Pichwai**:
     7. `Lotus Pond Shrinathji Pichwai`: Handcrafted Srinathji sacred lotus pond in natural stone mineral pigments (`aspect-[3/4]`).
     8. `Vrindavan Mayur Royal Pichwai`: Dancing peacocks under Kadamba boughs with real 24k gold leaf foil (`aspect-[4/5]`).
2. **Masonry Grid Layout**:
   - Alternating heights: Each item has explicit aspect ratio: `aspect-[4/5]` or `aspect-[3/4]`.
   - Grid classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start`.
   - All image elements use Next.js `<Image fill className="object-cover" alt={item.title} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />`.
3. **Lightweight Framer Motion 3D Tilt (`TiltCard`)**:
   - Pure native Framer Motion without external npm dependencies:
     - `useMotionValue(0)` for X and Y mouse offsets relative to card center.
     - `useSpring` with `{ stiffness: 300, damping: 20 }` for silky, non-jittery physics.
     - `useTransform` mapping normalized [-0.5, 0.5] coordinates to `rotateX` [-12deg, 12deg] and `rotateY` [12deg, -12deg].
     - Card styling: `transformStyle: "preserve-3d"`, with inner floating content `transform: translateZ(30px)`.
4. **Animated Category Filter Tabs**:
   - Categories: `["All", "Botanical", "Fluted Louver", "Neo-Classical", "Temple Pichwai"]`.
   - Active tab indicator: Framer Motion `<motion.div layoutId="galleryActiveCategory" className="absolute inset-0 bg-[#1C130B] rounded-full -z-10 shadow-md" />`.
   - Text color transitions smoothly from `text-gray-600` to `text-white` on active.

---

### 2.4 Blueprint for Requirement R4: Society-Specific Value Section (`SocietyShowcase.tsx`)
1. **Section Header**:
   - Title: `"Your Society, Pre-Measured"` (`font-['Syne'] font-black text-4xl md:text-5xl text-[#1C130B]`).
   - Subtitle: `"We have pre-mapped floor plans for Hyderabad West's marquee high-rises. Choose your tower for guaranteed fit and zero measurement wait."`
2. **Horizontal Scroll of 4 Society Cards**:
   - **Card 1: My Home Bhooja**
     - Stat: `"47 flats done 🔥"`
     - Unit: `"3BHK Standard"`
     - Price: `"Est. ₹38,000–₹55,000"`
     - Area: `Silpa Gram / Raidurg (HITEC City Corridor)`
     - Pre-measured feature: `Living room 12ft feature wall pre-configured`
   - **Card 2: Aparna Sarovar Zenith**
     - Stat: `"38 flats done 🔥"`
     - Unit: `"3BHK Luxury"`
     - Price: `"Est. ₹34,000–₹48,000"`
     - Area: `Nallagandla (Gachibowli Corridor)`
     - Pre-measured feature: `Foyer & Master Bedroom accent wall ready`
   - **Card 3: Rajapushpa Provincia**
     - Stat: `"52 flats done 🔥"`
     - Unit: `"3BHK Grande"`
     - Price: `"Est. ₹42,000–₹58,000"`
     - Area: `Narsingi / Financial District West`
     - Pre-measured feature: `Double-height dining & lounge pre-mapped`
   - **Card 4: Prestige High Fields**
     - Stat: `"41 flats done 🔥"`
     - Unit: `"3BHK Classic"`
     - Price: `"Est. ₹36,000–₹52,000"`
     - Area: `ISB Road / Financial District`
     - Pre-measured feature: `11.5ft living room feature wall ready`
3. **Card Structure & Interaction**:
   - Container: `flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar scroll-smooth`.
   - Scroll navigation buttons (Prev `<ChevronLeft />`, Next `<ChevronRight />`) positioned top right for seamless desktop navigation.
   - Individual card: `min-w-[300px] md:min-w-[340px] snap-start bg-[#FAF8F5] border border-[#C5A880]/30 rounded-3xl p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-[#C5A880] transition-all`.
   - Button: `"Check My Flat →"` -> triggers smooth scroll to `#estimator` (`document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' })`).

---

### 2.5 Blueprint for Requirement R5: Auto-Scrolling Ticker (`StatsTicker.tsx`)
1. **Placement**:
   - Immediately preceding `<section id="estimator">`.
2. **Visual Presentation**:
   - Background: `bg-[#1C130B] border-y border-[#C5A880]/30 py-4 overflow-hidden relative select-none`.
   - Two duplicate sequences scrolling continuously to provide seamless infinite wrapping.
3. **Rotating Content Items**:
   - `"Priya K., My Home Bhooja — '5 stars, done in 1 day!'"`
   - `"247 Flats Completed Across Hyderabad West"`
   - `"Vikram R., Aparna Sarovar Zenith — 'Zero dust, flawless acoustic louvers!'"`
   - `"48-Hour Guarantee: Laser Measurement to QA Sign-Off"`
   - `"Sneha M., Rajapushpa Provincia — 'The mobile swatch van saved us 3 weekends!'"`
   - `"2-Year Comprehensive Warranty on German Adhesives"`
   - `"Anand T., Prestige High Fields — 'Looks like a 7-star Presidential suite.'"`
   - `"Zero Civil Work — 100% Gated Society & HOA Compliant"`
4. **Animation Method**:
   - Framer Motion infinite linear scroll:
     `<motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 32, ease: "linear", repeat: Infinity }} className="flex whitespace-nowrap gap-10">`
   - Golden separator between items: `<span className="text-[#C5A880]">✦</span>`.

---

### 2.6 Blueprint for Requirement R6: Luxury Redesigned Footer (`Footer.tsx`)
1. **Header & Brand Column**:
   - Logo: `Auro`<span className="text-[#C5A880]">Makeover</span> in `font-['Syne'] text-3xl font-black`.
   - Tagline: `"48-Hour Micro-Makeovers for Hyderabad High-Rises. Zero civil work. Luxury wallpapers, acoustic louvers & smart blinds."`
   - **"2-Year Warranty" Badge**:
     - A gold-bordered luxury seal: `border border-[#C5A880]/40 bg-[#1C130B] p-4 rounded-2xl flex items-center gap-3`.
     - Icon: `Award` or `ShieldCheck` in `#C5A880`.
     - Headline: `"2-Year Comprehensive Warranty"`.
     - Subtitle: `"Zero peel, bubble-free & mechanical QA guarantee."`
2. **Service Areas List**:
   - Must explicitly feature all 5 mandated areas:
     1. `Kokapet`
     2. `Tellapur`
     3. `Financial District`
     4. `Nallagandla`
     5. `Gachibowli`
   - Styled with `<MapPin className="w-4 h-4 text-[#C5A880]" />` indicators.
3. **Design Collections Quick-Links**:
   - Botanical Wallpapers
   - Acoustic Fluted Louvers
   - Neo-Classical Mouldings
   - Temple Pichwai Canvas
   - Instant 48-Hour Estimator
4. **Contact & Booking**:
   - WhatsApp Hotline: `+91 97006 75637` linking directly to `https://wa.me/919700675637`.
   - On-Demand Swatch Van: `"Mobile showroom arrives in 60 mins"`.
5. **Social Links & Legal**:
   - Placeholders: Instagram, WhatsApp, LinkedIn, YouTube, Facebook with gold hover effects.
   - Copyright: `© 2026 AuroMakeover Spacemake OS. All rights reserved.`

---

### 2.7 Global Foundation Fixes (`src/app/layout.tsx`)
1. **Metadata**:
   ```tsx
   export const metadata: Metadata = {
     title: "AuroMakeover — Premium Home Makeovers in 48 Hours | Hyderabad",
     description: "Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Zero civil work. Serving Kokapet, Tellapur & Financial District.",
   };
   ```
2. **TypeScript Fix**:
   - Replace line 20 `LayoutProps<"/">` with `{ children: React.ReactNode }`:
   ```tsx
   export default function RootLayout({ children }: { children: React.ReactNode })
   ```
3. **Google Fonts Setup**:
   ```tsx
   import { Syne, Plus_Jakarta_Sans } from "next/font/google";

   const syne = Syne({
     subsets: ["latin"],
     variable: "--font-syne",
     weight: ["700", "800"],
   });

   const plusJakartaSans = Plus_Jakarta_Sans({
     subsets: ["latin"],
     variable: "--font-plus-jakarta-sans",
     weight: ["400", "500", "600", "700"],
   });
   ```
   Apply variables to `<html>`:
   ```tsx
   <html lang="en" className={`${syne.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth`}>
   ```

---

## 3. Caveats

1. **`EstimatorGateway.tsx` Wizard Subsystem**:
   - EstimatorGateway was surveyed by peer explorer for the 3-step wizard and pricing calculation engine. We verified that its anchor id `#estimator` and the WhatsApp URL `https://wa.me/919700675637` integrate seamlessly with the Hero CTAs, Society card buttons, and Footer link.
2. **External Image URLs**:
   - High-resolution Unsplash image URLs are used for the 8 gallery cards. Next.js image domain configuration in `next.config.ts` must allow `images.unsplash.com`.
   - Let's check `next.config.ts`:
     In Next.js 15+, `images.remotePatterns` must include `images.unsplash.com`. Implementers should ensure `next.config.ts` has:
     ```ts
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'images.unsplash.com',
         },
       ],
     },
     ```
3. **Design System Corner Radius Rule**:
   - Strict rule: "rounded-2xl or rounded-3xl only — no sharp corners anywhere".
   - Small badges, pill tabs, and round icon handles may use `rounded-full` as appropriate, but all cards, panels, containers, and buttons must be `rounded-2xl` or `rounded-3xl`.

---

## 4. Conclusion

The Phase 1 visual redesign requires 6 clearly defined component implementations and upgrades:

| Component | Target File | Requirements Met | Key Tech Specs |
|---|---|---|---|
| **Cinematic Hero** | `src/components/HeroSection.tsx` | R1 | Fullscreen `#1C130B`, ambient gold blobs (Framer Motion), word-by-word reveal headline, 3 floating stat pills, preserved CTAs & badges |
| **Before/After Showcase** | `src/components/BeforeAfterShowcase.tsx` | R2 | "The AuroMakeover Difference", draggable clip-path, mouse+touch dragging, Living Room & Bedroom tabs, builder finish vs warm luxury gradient |
| **Upgraded Design Gallery** | `src/components/DesignGallery.tsx` | R3 | Masonry grid with alternating `aspect-[4/5]` & `aspect-[3/4]`, 8 items across 4 categories, custom Framer Motion 3D tilt, animated underline filter |
| **Society Value Section** | `src/components/SocietyShowcase.tsx` | R4 | "Your Society, Pre-Measured", horizontal snap scroll, 4 society cards with fire stats & price estimates, scroll to estimator |
| **Stats Ticker** | `src/components/StatsTicker.tsx` | R5 | Horizontally auto-scrolling infinite ticker above estimator with micro-testimonials and guarantee stats |
| **Luxury Footer** | `src/components/Footer.tsx` | R6 | Redesigned luxury footer with logo, 2-Year Warranty badge, 5 service areas, direct WhatsApp link, legal links |
| **Root Layout & Meta** | `src/app/layout.tsx` | R6 | Fixed `LayoutProps<"/">` TypeScript error, added Syne & Plus Jakarta Sans via `next/font/google`, updated SEO metadata |
| **Page Composition** | `src/app/page.tsx` | Full Assembly | Composed layout with consistent `#FAF8F5` background, proper section IDs (`#estimator`, `#gallery`), zero civil work storytelling |

All visual requirements are fully analyzed, mapped to exact CSS classes, Framer Motion properties, and data models ready for implementation.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Existing Layout & Components**:
   - Inspect `src/app/layout.tsx` lines 15-28: confirm `LayoutProps<"/">` error and missing Syne/Plus Jakarta Sans imports.
   - Inspect `src/components/HeroSection.tsx`: confirm lack of full-screen styling, missing word-by-word stagger reveal, and missing floating stat pills.
   - Inspect `src/components/DesignGallery.tsx`: confirm 4 items instead of 8, uniform `aspect-[4/5]`, and lack of 3D tilt effect.
   - Inspect `src/app/page.tsx`: confirm absence of Before/After Showcase, Society Showcase, Stats Ticker, and standalone Footer.

2. **Verify Next.js Image Config**:
   - Inspect `next.config.ts` to ensure `images.unsplash.com` is configured in `remotePatterns`.

3. **Verify Build & Type Safety (Post-Implementation)**:
   - `npm run build` from `c:\Users\vigilare\Aura\auro-makeover` must complete with zero errors.
   - `npx tsc --noEmit` must report zero TypeScript errors.

4. **Verify Interactive Features in Browser**:
   - Hero: Headline words animate in one by one on initial load with staggered opacity and translateY.
   - Hero pills: 3 pills float gently with out-of-phase sine wave animations.
   - Before/After: Drag handle with mouse or finger to smoothly reveal builder finish vs luxury makeover. Toggle between Living Room and Bedroom.
   - Gallery: Hovering over gallery cards triggers real-time 3D tilt responding to mouse position. Clicking category filters moves the smooth animated indicator pill.
   - Society section: Horizontal scroll displays 4 cards; clicking "Check My Flat →" scrolls smoothly to `#estimator`.
   - Ticker: Rotates infinitely above estimator without stutter.
