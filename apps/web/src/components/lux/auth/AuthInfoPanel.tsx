type AuthInfoPanelProps = {
  title?: string;
  highlight?: string;
  description?: string;
};

export function AuthInfoPanel({
  title = 'ĐĂNG NHẬP',
  highlight = 'ĐĂNG KÝ NGAY',
  description = 'Đăng nhập, đăng ký để mua sắm và nhận các ưu đãi hấp dẫn chỉ dành riêng cho thành viên LUX Sneakers.',
}: AuthInfoPanelProps) {
  return (
    <div className="group relative hidden flex-col items-center justify-center overflow-hidden bg-black p-12 text-center md:flex">
      <div className="absolute inset-0 scale-110 bg-[url('/hero-image.webp')] bg-cover bg-center opacity-30 transition-opacity duration-700 group-hover:opacity-40" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />

      <div className="relative z-10 space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-500"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2 className="text-4xl leading-tight font-extrabold tracking-tight">
          {title}
          <br />
          <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {highlight}
          </span>
        </h2>

        <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}
