'use client';

export function AdminHeader() {
  return (
    <header className="bg-background sticky top-0 z-30 flex h-16 items-center border-b border-amber-500/20 px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Admin Panel LUX Sneakers</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@luxsneakers.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
