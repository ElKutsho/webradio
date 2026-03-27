import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-white/80 text-lg font-medium tracking-wider uppercase">
          Kutsho Radio
        </h1>
        {children}
      </div>
    </main>
  );
}
