import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check, Palette, Home, Sparkles, DollarSign, Loader2 } from 'lucide-react';

const STEPS = [
  { key: 'roomType', label: 'Room', icon: Home },
  { key: 'styleVibe', label: 'Vibe', icon: Sparkles },
  { key: 'colorPreference', label: 'Colors', icon: Palette },
  { key: 'mustHaves', label: 'Must-haves', icon: Check },
  { key: 'budgetTier', label: 'Budget', icon: DollarSign },
] as const;

type StepKey = typeof STEPS[number]['key'];

const OPTIONS: Record<StepKey, { value: string; label: string; icon?: React.ReactNode; description?: string }[]> = {
  roomType: [
    { value: 'living', label: 'Living Room', description: 'Main gathering space' },
    { value: 'bedroom', label: 'Bedroom', description: 'Personal retreat' },
    { value: 'dining', label: 'Dining Room', description: 'Entertaining space' },
    { value: 'office', label: 'Home Office', description: 'Work from home' },
    { value: 'pooja', label: 'Pooja Room', description: 'Sacred space' },
    { value: 'full-home', label: 'Full Home', description: 'Complete makeover' },
  ],
  styleVibe: [
    { value: 'modern-minimal', label: 'Modern Minimal', description: 'Clean lines, uncluttered' },
    { value: 'warm-traditional', label: 'Warm Traditional', description: 'Heritage-inspired comfort' },
    { value: 'luxury-glam', label: 'Luxury Glam', description: 'Opulent, statement pieces' },
    { value: 'eclectic-boho', label: 'Eclectic Boho', description: 'Curated, collected feel' },
    { value: 'zen-nature', label: 'Zen Nature', description: 'Calm, organic, grounded' },
  ],
  colorPreference: [
    { value: 'neutrals', label: 'Neutrals', description: 'Whites, beiges, greys' },
    { value: 'earth-tones', label: 'Earth Tones', description: 'Terracotta, ochre, sage' },
    { value: 'jewel-tones', label: 'Jewel Tones', description: 'Emerald, sapphire, ruby' },
    { value: 'pastels', label: 'Soft Pastels', description: 'Blush, mint, powder blue' },
    { value: 'dark-moody', label: 'Dark & Moody', description: 'Charcoal, navy, forest' },
  ],
  mustHaves: [
    { value: 'feature-wallpaper', label: 'Feature Wallpaper', description: 'Botanical, geometric, textured' },
    { value: 'acoustic-panels', label: 'Acoustic Fluted Panels', description: 'Sound-absorbing walnut slats' },
    { value: 'smart-blinds', label: 'Smart Motorized Blinds', description: 'App/voice controlled' },
    { value: 'concealed-lighting', label: 'Concealed LED Lighting', description: 'Cove, profile, accent' },
    { value: 'heritage-mouldings', label: 'Heritage Mouldings', description: 'Neo-classical, Pichwai details' },
  ],
  budgetTier: [
    { value: 'essential', label: 'Essential', description: 'Smart finishes, core rooms' },
    { value: 'premium', label: 'Premium', description: 'Full palette, smart upgrades' },
    { value: 'luxury', label: 'Luxury', description: 'Bespoke, motorized, concierge' },
  ],
};

const STORAGE_KEY = 'auromakeover_quiz_v1';

export type QuizAnswers = {
  roomType?: string;
  styleVibe?: string;
  colorPreference?: string;
  mustHaves?: string[];
  budgetTier?: string;
};

const OptionCard = memo(function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: { value: string; label: string; description?: string };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-2xl p-4 text-left transition-all ${
        selected
          ? 'bg-[#1C130B] text-[#FAF8F5] border-2 border-[#C5A880] shadow-[0_0_0_1px_#C5A880]'
          : 'bg-[#FAF8F5] text-[#1C130B] border border-[#1C130B]/10 hover:border-[#C5A880]/50 hover:bg-[#FAF8F5]/80'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-[#1C130B]/5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">{option.label}</p>
          {option.description && <p className="text-xs mt-0.5 opacity-70">{option.description}</p>}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C5A880] flex items-center justify-center text-[#1C130B]"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
});

const StepContent = memo(function StepContent({
  stepKey,
  answers,
  handleSelect,
}: {
  stepKey: StepKey;
  answers: QuizAnswers;
  handleSelect: (stepKey: StepKey, value: string, multi: boolean) => void;
}) {
  const options = OPTIONS[stepKey];
  const multi = stepKey === 'mustHaves';

  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <p className="text-[#1C130B]/50 text-sm mb-6 text-center max-w-lg mx-auto">
        {stepKey === 'roomType' && 'Which room are you transforming?'}
        {stepKey === 'styleVibe' && "What's your design vibe?"}
        {stepKey === 'colorPreference' && 'Which color palette speaks to you?'}
        {stepKey === 'mustHaves' && 'Select all that apply — we\'ll match designs to your must-haves.'}
        {stepKey === 'budgetTier' && "What's your investment tier?"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            option={opt}
            selected={multi ? (answers[stepKey] as string[])?.includes(opt.value) : answers[stepKey] === opt.value}
            onClick={() => handleSelect(stepKey, opt.value, multi)}
          />
        ))}
      </div>
    </motion.div>
  );
});

export default function StyleQuiz({ onComplete }: { onComplete: (answers: QuizAnswers) => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
      } catch { return {}; }
    }
    return {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const handleSelect = useCallback((stepKey: StepKey, value: string, multi = false) => {
    setAnswers((prev) => {
      if (multi) {
        const current = (prev[stepKey] as string[]) || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [stepKey]: updated };
      }
      return { ...prev, [stepKey]: value };
    });
  }, []);

  const isStepComplete = (stepKey: StepKey) => {
    const val = answers[stepKey];
    if (stepKey === 'mustHaves') return Array.isArray(val) && val.length > 0;
    return !!val;
  };

  const canGoNext = isStepComplete(STEPS[currentStep].key);
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (!canGoNext) return;
    if (isLastStep) {
      setIsSubmitting(true);
      setTimeout(() => { onComplete(answers); setIsSubmitting(false); }, 300);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-[#1C130B]/5">
        <motion.div
          layout
          className="h-full bg-gradient-to-r from-[#C5A880] to-[#8A5836]"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <motion.span
              key={step.key}
              layout
              className={`w-2 h-2 rounded-full transition-all ${
                i < currentStep ? 'bg-[#C5A880]' : i === currentStep ? 'bg-[#8A5836] w-6' : 'bg-[#1C130B]/20'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-xl border border-[#1C130B]/10 p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Style Quiz — Step {currentStep + 1} of {STEPS.length}
            </p>
            <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#1C130B]">
              {STEPS[currentStep].label}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <StepContent
              key={STEPS[currentStep].key}
              stepKey={STEPS[currentStep].key}
              answers={answers}
              handleSelect={handleSelect}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#1C130B]/10">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-[#1C130B]/50 hover:text-[#1C130B] font-medium text-sm flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isSubmitting}
              className="bg-[#1C130B] hover:bg-[#1C130B]/90 text-[#FAF8F5] px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : isLastStep ? (
                <> Get My Estimate <ArrowRight className="w-4 h-4" /> </>
              ) : (
                <> Next <ArrowRight className="w-4 h-4" /> </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Skip link */}
        <p className="mt-6 text-center text-[#1C130B]/40 text-sm">
          Already know what you want?{' '}
          <button
            onClick={() => router.push('/#estimator')}
            className="text-[#8A5836] font-semibold hover:underline"
          >
            Jump to estimator →
          </button>
        </p>
      </main>
    </div>
  );
}