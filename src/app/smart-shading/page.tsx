import { Metadata } from 'next';
import SmartLightingConfigurator from '@/components/SmartLightingConfigurator';
import EstimatorGateway from '@/components/EstimatorGateway';

export const metadata: Metadata = {
  title: 'Smart Shading & Architectural Lighting Configurator | AuroMakeover',
  description: 'Design motorized Matter/Zigbee honeycomb shading and zero-civil 3000K ambient LED cove extrusions for your high-rise apartment.',
};

export default function SmartShadingPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] overflow-x-hidden pt-20">
      <SmartLightingConfigurator />
      <EstimatorGateway />
    </main>
  );
}
