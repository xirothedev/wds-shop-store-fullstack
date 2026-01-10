export function MiniSearchBar() {
  return (
    <>
      <div className="relative mt-2 mb-2 flex w-full flex-row items-center rounded-xl border-2 border-white/10 p-2 focus-within:border-amber-500 hover:border-amber-500 md:max-w-75">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          className="ml-1 w-full border-none outline-none"
          type="search"
          placeholder="Search"
        />
      </div>
    </>
  );
}
