import type React from 'react';

import { Button } from './Button';

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
        <Button variant="primary" size="lg">
          {primaryCtaLabel}
        </Button>
        {secondaryCtaLabel ? (
          <Button variant="outline" size="lg">
            {secondaryCtaLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
