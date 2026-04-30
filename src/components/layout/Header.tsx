'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function Header({ title, subtitle, backHref, onBack, icon, action }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    if (backHref) { router.push(backHref); return; }
    router.back();
  };

  return (
    <div className="px-5 py-2 flex items-center gap-3 flex-shrink-0">
      {(backHref || onBack) && (
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 active:bg-black/10 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {icon && (
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-[17px] font-bold text-gray-900 truncate">{title}</h2>
        {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
