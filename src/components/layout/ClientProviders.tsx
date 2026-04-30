'use client';

import { type ReactNode } from 'react';
import { useSSE } from '@/hooks/useSSE';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { useParking, useParkingDispatch } from '@/context/ParkingContext';

/**
 * Client-side providers: initializes SSE + Socket.IO connections
 * and handles global socket events (navigation to success screens etc.)
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const state = useParking();
  const dispatch = useParkingDispatch();

  // Start SSE for real-time slot updates
  useSSE();

  // Start Socket.IO for parking/payment events
  useSocket({
    onParkingSuccessful: (data) => {
      if (state.sessionId && data.session_id === state.sessionId) {
        router.push('/parked');
      }
    },
    onPaymentSuccessful: (data) => {
      // Store reference code if available, then navigate
      void data;
      router.push('/payment-success');
    },
  });

  return <>{children}</>;
}
