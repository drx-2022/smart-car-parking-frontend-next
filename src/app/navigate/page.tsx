'use client';

import { useRouter } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import Header from '@/components/layout/Header';
import CameraFeed from '@/components/features/CameraFeed';
import Button from '@/components/ui/Button';
import { InfoCard, InfoRow } from '@/components/ui/Card';
import { useParking, useParkingDispatch } from '@/context/ParkingContext';
import { finishParking } from '@/lib/api';
import { CAM_URL } from '@/lib/constants';

export default function NavigatePage() {
  const router = useRouter();
  const state = useParking();
  const dispatch = useParkingDispatch();

  const handleFinishAndGoBack = async () => {
    if (!state.sessionId) { router.push('/'); return; }
    try {
      const slotInfo = state.slotData[state.slotId || ''];
      const slotUuid = slotInfo?.uuid || state.slotId || undefined;
      await finishParking(state.sessionId, slotUuid);
    } catch (e) {
      console.warn(e);
    }
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  return (
    <MobileShell>
      <Header
        title="Camera dẫn đường"
        subtitle="Theo dõi ô đỗ trên camera AI"
        onBack={handleFinishAndGoBack}
      />

      {/* Camera */}
      <CameraFeed
        src={CAM_URL}
        slotLabel={state.slotId ? `Ô: ${state.slotId}` : 'Đang tìm...'}
      />

      {/* Bottom info sheet */}
      <div className="bg-gray-50 border-t border-black/10 rounded-t-2xl mt-3 px-5 py-4 flex-shrink-0">
        {/* Drag handle */}
        <div className="w-9 h-0.5 bg-black/10 rounded-full mx-auto mb-4" />

        <div className="mb-3">
          <div className="text-[13px] font-bold text-gray-900 mb-0.5">
            Hệ thống đang dẫn đường
          </div>
          <div className="text-[11px] text-gray-500">
            AI sẽ hiển thị đường đi ngay trên camera
          </div>
        </div>

        <InfoCard className="mb-3">
          <InfoRow label="Ô đỗ mục tiêu" value={state.slotId || 'Đang tìm...'} />
          <InfoRow label="Biển số xe" value={state.plate || '–'} />
          <InfoRow
            label="Session ID"
            value={state.sessionId?.slice(0, 8) + '…' || '–'}
            last
            valueClassName="text-[10px] text-gray-400"
          />
        </InfoCard>

        <Button variant="green" onClick={() => router.push('/parked')}>
          Tôi đã đến nơi ✓
        </Button>
      </div>
    </MobileShell>
  );
}
