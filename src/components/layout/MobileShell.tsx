'use client';

import { type ReactNode } from 'react';

/**
 * Responsive container: full viewport on mobile, centered card (max 480px) on desktop.
 * Replaces the fixed 390px ".phone" wrapper from the old frontend.
 */
export default function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-100 flex items-center justify-center">
      <div
        className="
          w-full min-h-dvh
          md:max-w-[480px] md:min-h-0 md:my-6 md:rounded-3xl md:shadow-2xl
          bg-white flex flex-col overflow-hidden relative
        "
      >
        {children}
      </div>
    </div>
  );
}
