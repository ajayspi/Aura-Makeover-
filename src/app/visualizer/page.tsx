import { Metadata } from 'next';
import HomographyCanvasVisualizer from '@/components/HomographyCanvasVisualizer';
import EstimatorGateway from '@/components/EstimatorGateway';

export const metadata: Metadata = {
  title: '2.5D Real-Time Wall Perspective Visualizer | AuroMakeover',
  description: 'Instant zero-app 4-point wall perspective transformation with day/night ambient lighting simulation. Preview luxury textures directly on your room walls.',
};

export default function VisualizerPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] overflow-x-hidden pt-20">
      <div className="py-12 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#8A5836] text-xs font-bold uppercase tracking-widest font-['Plus_Jakarta_Sans'] mb-2 block">
            Instant Spatial Simulation
          </span>
          <h1 className="font-['Syne'] text-3xl sm:text-5xl font-black text-[#1C130B] mb-4">
            Interactive Room Canvas Visualizer
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#1C130B]/70 max-w-2xl mx-auto">
            Drag the 4 corner pins to map luxury finishes onto any perspective angle. Toggle day and night lighting to see real ambient texture behavior.
          </p>
        </div>
        <HomographyCanvasVisualizer />
      </div>
      <EstimatorGateway />
    </main>
  );
}
