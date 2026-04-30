'use client';

import { useParking } from '@/context/ParkingContext';

export default function ConnectionBadge() {
  const { connected } = useParking();

  return (
    <div
      className={`
        mx-5 mb-2 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-medium
        transition-all duration-300
        ${
          connected
            ? 'bg-emerald-600/8 border border-emerald-600/20 text-emerald-600'
            : 'bg-red-500/8 border border-red-500/20 text-red-500'
        }
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      {connected ? 'Kết nối thời gian thực ✓' : 'Mất kết nối · Đang thử lại…'}
    </div>
  );
}
