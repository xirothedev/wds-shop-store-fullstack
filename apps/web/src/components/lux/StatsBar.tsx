import type { StatItem } from './types';

type StatsBarProps = {
  items: StatItem[];
};

export function StatsBar({ items }: StatsBarProps) {
  return (
    <section className="border-y border-white/10 bg-white/5 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 text-center md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-extrabold text-transparent">
              {item.value}
            </div>
            <div className="mt-2 text-sm tracking-widest text-gray-500 uppercase">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
