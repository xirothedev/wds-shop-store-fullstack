import type React from 'react';

type HeroSectionProps = {
  badge: string;
  title: React.ReactNode;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
};

export function HeroSection({
  badge,
  title,
  description,
  primaryCtaLabel,
  secondaryCtaLabel,
}: HeroSectionProps) {
  return (
    <div className="space-y-8">
      <div className="inline-block rounded-full border border-amber-500/30 px-4 py-1 text-sm font-semibold tracking-widest text-amber-500 uppercase">
        {badge}
      </div>
      <h1 className="text-6xl leading-tight font-extrabold md:text-8xl">
        {title}
      </h1>
      <p className="max-w-md text-lg text-gray-400">{description}</p>
      <div className="flex space-x-4">
        <button className="rounded-xl bg-linear-to-br from-amber-400 to-amber-600 px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]">
          {primaryCtaLabel}
        </button>
        {secondaryCtaLabel ? (
          <button className="rounded-xl border border-white/20 px-8 py-4 font-bold transition-all hover:bg-white/10">
            {secondaryCtaLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
