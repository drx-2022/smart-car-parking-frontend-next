'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'blue' | 'green' | 'amber' | 'ghost';

const variantClasses: Record<Variant, string> = {
  blue: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white',
  green: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white',
  amber: 'bg-gradient-to-br from-amber-600 to-amber-700 text-white',
  ghost: 'bg-black/5 text-gray-900 border border-black/10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  variant = 'blue',
  children,
  loading,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        w-full py-3.5 rounded-xl font-bold text-sm tracking-wide
        transition-all duration-150
        active:opacity-85 active:scale-[0.99]
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Đang xử lý…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
