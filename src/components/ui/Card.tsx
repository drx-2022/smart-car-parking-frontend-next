import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-black/10 rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  last?: boolean;
  valueClassName?: string;
}

export function InfoRow({ label, value, last, valueClassName = '' }: InfoRowProps) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${last ? '' : 'border-b border-black/5'}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold text-gray-900 ${valueClassName}`}>{value}</span>
    </div>
  );
}

export function InfoCard({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-black/10 rounded-xl px-4 py-2 ${className}`}>
      {children}
    </div>
  );
}
