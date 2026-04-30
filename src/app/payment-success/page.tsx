'use client';

import { useRouter } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import Button from '@/components/ui/Button';
import { InfoCard, InfoRow } from '@/components/ui/Card';
import TimerBox from '@/components/ui/TimerBox';
import { useParking, useParkingDispatch } from '@/context/ParkingContext';
import { useCountDown } from '@/hooks/useTimer';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const state = useParking();
  const dispatch = useParkingDispatch();
  const { display: exitTimer } = useCountDown(900, true);

  const handleFinish = () => {
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  return (
    <MobileShell>
      <div className="flex-1 flex flex-col items-center px-5 py-8 gap-3">
        <div className="w-20 h-20 rounded-full bg-blue-400/12 border-2 border-blue-400/35 flex items-center justify-center">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#63B3ED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 text-center">Thanh toán thành công</h1>
        <p className="text-[13px] text-gray-500 text-center">Cảm ơn bạn đã sử dụng dịch vụ</p>
        <div className="w-full">
          <TimerBox label="Thời gian còn lại để ra khỏi bãi" value={exitTimer} variant="green" />
        </div>
        <InfoCard className="w-full">
          <InfoRow label="Biển số xe" value={state.plate || '–'} />
          <InfoRow label="Ô đỗ xe" value={state.slotId || '–'} />
          <InfoRow label="Số tiền" value={state.fee ? `${state.fee.toLocaleString('vi-VN')} VNĐ` : '–'} valueClassName="text-emerald-600" />
          <InfoRow label="Mã giao dịch" value="Đã xác nhận" last valueClassName="text-[10px] text-gray-400" />
        </InfoCard>
        <Button variant="green" onClick={handleFinish} className="w-full">Hoàn tất · Quay về trang chủ</Button>
      </div>
    </MobileShell>
  );
}
