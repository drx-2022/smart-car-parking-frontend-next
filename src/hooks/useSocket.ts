'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants';
import { useParking } from '@/context/ParkingContext';

interface SocketCallbacks {
  onParkingSuccessful?: (data: { session_id: string; slot_id: string; message: string }) => void;
  onPaymentSuccessful?: (data: { license_plate: string; message: string; reference_code?: string }) => void;
}

/**
 * Connects to Socket.IO and fires callbacks for parking/payment events.
 */
export function useSocket(callbacks: SocketCallbacks) {
  const socketRef = useRef<Socket | null>(null);
  const state = useParking();

  useEffect(() => {
    try {
      const socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      socket.on('parking_successful', (data) => {
        console.log('Parking successful:', data);
        if (state.sessionId && data.session_id === state.sessionId) {
          callbacks.onParkingSuccessful?.(data);
        }
      });

      socket.on('payment_successful', (data) => {
        console.log('Payment successful:', data);
        callbacks.onPaymentSuccessful?.(data);
      });

      return () => {
        socket.disconnect();
      };
    } catch (e) {
      console.warn('Socket.IO not available:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sessionId]);
}
