'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import Header from '@/components/layout/Header';
import ConnectionBadge from '@/components/features/ConnectionBadge';
import PlateInput from '@/components/features/PlateInput';
import Button from '@/components/ui/Button';
import { useParking, useParkingDispatch } from '@/context/ParkingContext';
import { startSession, updateLicense } from '@/lib/api';
import { CAM_URL } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useParkingDispatch();
  const [plate, setPlate] = useState('');
  const [payPlate, setPayPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const handleRegister = async () => {
    const p = plate.trim().toUpperCase();
    if (!p) { alert('Vui lòng nhập biển số xe!'); return; }
    setLoading(true);
    try {
      const res = await startSession(CAM_URL);
      dispatch({ type: 'SET_SESSION', sessionId: res.session_id });

      await updateLicense('UNKNOWN', p);

      dispatch({ type: 'SET_PLATE', plate: p });
      dispatch({ type: 'SET_PARK_START', time: Date.now() });

      router.push('/navigate');
    } catch (e) {
      alert('Lỗi đăng ký: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayLater = () => {
    const p = payPlate.trim().toUpperCase();
    if (!p) { alert('Vui lòng nhập biển số xe!'); return; }
    setPayLoading(true);
    dispatch({ type: 'SET_PLATE', plate: p });
    router.push(`/pay-later?plate=${encodeURIComponent(p)}`);
  };

  return (
    <MobileShell>
      {/* Header */}
      <Header
        title="Đăng ký vào bãi"
        subtitle="Nhập biển số xe để bắt đầu"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
      />

      <ConnectionBadge />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-5 gap-3.5 pb-8">
        {/* ── Entry Registration Card ── */}
        <div className="bg-white border border-black/10 rounded-2xl p-5">
          <p className="text-[13px] text-gray-800 mb-4 leading-relaxed">
            Vui lòng nhập biển số xe của bạn trước khi vào bãi. Hệ thống sẽ tự động nhận diện vị trí đỗ xe.
          </p>
          <PlateInput id="plate-input" value={plate} onChange={setPlate} />
          <Button variant="blue" onClick={handleRegister} loading={loading}>
            Đăng ký vào bãi →
          </Button>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-[11px] text-gray-500">hoặc</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* ── Pay Later Card ── */}
        <div className="bg-white border border-amber-400/25 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-amber-400/15 border border-amber-400/30 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-900">Thanh toán xe của bạn</div>
              <div className="text-[11px] text-gray-500">Dành cho xe đã đỗ trong bãi</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-800 leading-relaxed mb-3">
            Nhập biển số xe để tìm kiếm phiên đỗ xe và hoàn tất thanh toán.
          </p>
          <PlateInput id="pay-later-plate" value={payPlate} onChange={setPayPlate} />
          <Button variant="amber" onClick={handlePayLater} loading={payLoading}>
            Tìm kiếm phiên đỗ xe →
          </Button>
        </div>

        {/* ── Note ── */}
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-3.5 py-2">
          <div className="text-[11px] text-amber-600 font-semibold mb-1">Lưu ý</div>
          <div className="text-[11px] text-amber-700/80 leading-relaxed">
            AI sẽ tự động phát hiện vị trí đỗ xe của bạn. Hãy làm theo hướng dẫn trên màn hình.
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
