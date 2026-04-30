'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { InfoCard, InfoRow } from '@/components/ui/Card';
import QRDisplay from '@/components/ui/QRDisplay';
import { useParking, useParkingDispatch } from '@/context/ParkingContext';
import { startPayment, manualPaymentFinish } from '@/lib/api';
import { useDuration } from '@/hooks/useTimer';

export default function PaymentPage() {
  const router = useRouter();
  const state = useParking();
  const dispatch = useParkingDispatch();
  const duration = useDuration(state.parkStart);

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState<string | null>(null);
  const [payContent, setPayContent] = useState('–');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!state.sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await startPayment(state.sessionId!);
        if (cancelled) return;
        dispatch({ type: 'SET_PAYMENT', fee: res.fee, content: res.content });
        setQrUrl(res.qr_url);
        setPayContent(res.content);
      } catch (e) {
        if (!cancelled) setQrError((e as Error).message);
      } finally {
        if (!cancelled) setQrLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [state.sessionId, dispatch]);

  const handleManualConfirm = async () => {
    if (!state.sessionId) return;
    setConfirming(true);
    try {
      await manualPaymentFinish(state.sessionId);
      router.push('/payment-success');
    } catch (e) {
      alert('Lỗi xác nhận thanh toán: ' + (e as Error).message);
      setConfirming(false);
    }
  };

  return (
    <MobileShell>
      <Header
        title="Thanh toán đỗ xe"
        subtitle="Quét mã QR để thanh toán"
        backHref="/parked"
      />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Amount card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-5 text-center mb-3.5">
          <div className="text-[11px] text-white/60 mb-1.5">Tổng phí đỗ xe</div>
          <div>
            <span className="text-[34px] font-bold text-white">
              {state.fee ? state.fee.toLocaleString('vi-VN') : '–'}
            </span>{' '}
            <span className="text-[15px] text-white/70">VNĐ</span>
          </div>
          <div className="text-[11px] text-white/40 mt-1.5">{duration}</div>
        </div>

        {/* QR code */}
        <div className="mb-3">
          <QRDisplay qrUrl={qrUrl} loading={qrLoading} error={qrError} />
        </div>

        {/* Transfer content */}
        <InfoCard className="mb-3">
          <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">
            Nội dung chuyển khoản
          </div>
          <div className="text-sm font-bold text-blue-600 tracking-wide">{payContent}</div>
        </InfoCard>

        {/* Session info */}
        <InfoCard className="mb-3">
          <InfoRow label="Ô đỗ xe" value={state.slotId || '–'} />
          <InfoRow label="Biển số xe" value={state.plate || '–'} />
          <InfoRow
            label="Trạng thái"
            value="Chờ thanh toán…"
            last
            valueClassName="text-amber-600"
          />
        </InfoCard>

        {/* Note */}
        <p className="text-[11px] text-gray-500 text-center leading-relaxed mb-5">
          Sau khi chuyển khoản thành công, cổng ra sẽ tự động mở.<br />
          Bạn có <strong className="text-amber-600">15 phút</strong> để ra khỏi bãi.
        </p>

        <Button variant="green" onClick={handleManualConfirm} loading={confirming}>
          Đã thanh toán (Mô phỏng) ✓
        </Button>
      </div>
    </MobileShell>
  );
}
