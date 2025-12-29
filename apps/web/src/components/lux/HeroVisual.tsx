import Image from 'next/image';

export function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="float-img relative z-10 w-full max-w-[500px]">
        <Image
          src="/hero-image.webp"
          alt="LUX Sneakers Black & Gold Edition"
          width={800}
          height={600}
          priority
          className="h-auto w-full drop-shadow-[0_35px_35px_rgba(251,191,36,0.2)]"
        />
      </div>
      <div className="pointer-events-none absolute -z-10 text-[15rem] font-black text-white/5 select-none">
        GOLD
      </div>
    </div>
  );
}
