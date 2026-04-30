'use client';

import { useRouter } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import Button from '@/components/ui/Button';
import { InfoCard, InfoRow } from '@/components/ui/Card';
import { useParking, useParkingDispatch } from '@/context/ParkingContext';

export default function ParkedPage() {
  const router = useRouter();
  const state = useParking();
  const dispatch = useParkingDispatch();

  const timeStr = state.parkStart
    ? new Date(state.parkStart).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : '–';

  const handleExit = () => {
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  return (
    <MobileShell>
      <div className="flex-1 flex flex-col items-center px-5 py-8 gap-3">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-400/12 border-2 border-emerald-400/35 flex items-center justify-center">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center">Đỗ xe thành công!</h1>
        <p className="text-[13px] text-gray-500 text-center">
          Xe của bạn đã được ghi nhận tại ô{' '}
          <span className="text-blue-600 font-bold">{state.slotId || '–'}</span>
        </p>

        <InfoCard className="w-full">
          <InfoRow label="Biển số xe" value={state.plate || '–'} />
          <InfoRow label="Ô đỗ" value={state.slotId || '–'} />
          <InfoRow label="Thời gian vào" value={timeStr} />
          <InfoRow
            label="Session ID"
            value={state.sessionId?.slice(0, 8) + '…' || '–'}
            last
            valueClassName="text-[10px] text-gray-400"
          />
        </InfoCard>

        {/* Confirmation banner */}
        <div className="bg-emerald-400/7 border border-emerald-400/20 rounded-xl p-3.5 w-full text-center">
          <div className="text-xs text-emerald-500 font-semibold mb-1">✓ Xe đã được ghi nhận</div>
          <div className="text-[11px] text-gray-700 leading-relaxed">
            Bạn có thể rời ứng dụng và quay lại thanh toán khi lấy xe.
          </div>
        </div>

        <Button variant="amber" onClick={() => router.push('/payment')} className="w-full">
          Thanh toán ngay →
        </Button>
        <Button variant="ghost" onClick={handleExit} className="w-full">
          Thoát • Thanh toán sau
        </Button>
      </div>
    </MobileShell>
  );
}
