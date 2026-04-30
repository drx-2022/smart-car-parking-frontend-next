'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { InfoCard, InfoRow } from '@/components/ui/Card';
import QRDisplay from '@/components/ui/QRDisplay';
import { useParkingDispatch } from '@/context/ParkingContext';
import { lookupSessionByPlate, startPayment, manualPaymentFinish } from '@/lib/api';

function PayLaterContent() {
  const router = useRouter();
  const dispatch = useParkingDispatch();
  const searchParams = useSearchParams();
  const plate = searchParams.get('plate') || '';

  const [notFound, setNotFound] = useState(false);
  const [found, setFound] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [slotNumber, setSlotNumber] = useState('–');
  const [startTime, setStartTime] = useState('–');
  const [amount, setAmount] = useState('5.000');
  const [payContent, setPayContent] = useState('–');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!plate) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await lookupSessionByPlate(plate);
        if (cancelled) return;

        if (!data.found || data.is_paid) {
          setNotFound(true);
          return;
        }

        setSessionId(data.session_id || '');
        setSlotNumber(data.slot_number || '–');
        dispatch({ type: 'SET_SESSION', sessionId: data.session_id || '' });
        dispatch({ type: 'SET_PLATE', plate: data.license_plate || plate });
        if (data.slot_number) dispatch({ type: 'SET_SLOT', slotId: data.slot_number });

        if (data.start_time) {
          const st = new Date(data.start_time);
          setStartTime(st.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }));
        }

        // Fetch QR
        try {
          const payRes = await startPayment(data.session_id!);
          if (cancelled) return;
          dispatch({ type: 'SET_PAYMENT', fee: payRes.fee, content: payRes.content });
          setAmount(payRes.fee?.toLocaleString('vi-VN') || '5.000');
          setPayContent(payRes.content);
          setQrUrl(payRes.qr_url);
        } catch (e) {
          if (!cancelled) setQrError((e as Error).message);
        }

        setFound(true);
      } catch (e) {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setQrLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [plate, dispatch]);

  const handleConfirm = async () => {
    if (!sessionId) return;
    setConfirming(true);
    try {
      await manualPaymentFinish(sessionId);
      router.push('/payment-success');
    } catch (e) {
      alert('Lỗi xác nhận thanh toán: ' + (e as Error).message);
      setConfirming(false);
    }
  };

  return (
    <MobileShell>
      <Header title="Thanh toán đỗ xe" subtitle="Tìm phiên đỗ xe theo biển số" backHref="/" />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {notFound && (
          <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm font-bold text-red-500 mb-1">Không tìm thấy phiên</div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Biển số xe này không có phiên đỗ xe nào đang hoạt động, hoặc đã được thanh toán.
            </div>
          </div>
        )}

        {found && (
          <>
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-5 text-center mb-3.5">
              <div className="text-[11px] text-white/60 mb-1.5">Tổng phí đỗ xe</div>
              <div>
                <span className="text-[34px] font-bold text-white">{amount}</span>{' '}
                <span className="text-[15px] text-white/70">VNĐ</span>
              </div>
            </div>

            <InfoCard className="mb-3">
              <InfoRow label="Biển số xe" value={plate} />
              <InfoRow label="Ô đỗ" value={slotNumber} />
              <InfoRow label="Thời gian vào" value={startTime} last />
            </InfoCard>

            <div className="mb-3">
              <QRDisplay qrUrl={qrUrl} loading={qrLoading} error={qrError} />
            </div>

            <InfoCard className="mb-3">
              <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">Nội dung chuyển khoản</div>
              <div className="text-sm font-bold text-blue-600 tracking-wide">{payContent}</div>
            </InfoCard>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed mb-4">
              Sau khi chuyển khoản thành công, cổng ra sẽ tự động mở.<br />
              Bạn có <strong className="text-amber-600">15 phút</strong> để ra khỏi bãi.
            </p>

            <Button variant="green" onClick={handleConfirm} loading={confirming}>
              Đã thanh toán (Mô phỏng) ✓
            </Button>
          </>
        )}
      </div>
    </MobileShell>
  );
}

export default function PayLaterPage() {
  return (
    <Suspense fallback={<MobileShell><div className="flex-1 flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" /></div></MobileShell>}>
      <PayLaterContent />
    </Suspense>
  );
}
