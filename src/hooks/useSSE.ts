'use client';

import { useEffect, useRef, useCallback } from 'react';
import { SSE_URL } from '@/lib/constants';
import { useParkingDispatch, useParking } from '@/context/ParkingContext';
import type { SlotsSnapshot } from '@/types/parking';

/**
 * Connects to the SSE endpoint and dispatches slot/session updates.
 * Also updates connection status.
 * Automatically reconnects on error.
 */
export function useSSE() {
  const dispatch = useParkingDispatch();
  const state = useParking();
  const sourceRef = useRef<EventSource | null>(null);

  const onSlotsUpdate = useCallback(
    (data: SlotsSnapshot) => {
      const slotsArray = Array.isArray(data.slots) ? data.slots : [];

      // Build slotData lookup
      const slotData: Record<string, { uuid: string; occupied: boolean }> = {};
      slotsArray.forEach((s) => {
        slotData[s.slot_number] = { uuid: s.id, occupied: s.is_occupied };
      });
      dispatch({ type: 'UPDATE_SLOTS', slotData });

      // Update slot if our session got assigned by the AI
      if (state.sessionId && Array.isArray(data.active_sessions)) {
        const mySession = data.active_sessions.find((s) => s.id === state.sessionId);
        if (mySession?.slot_id) {
          const mySlot = slotsArray.find((s) => s.id === mySession.slot_id);
          if (mySlot && mySlot.slot_number !== state.slotId) {
            dispatch({ type: 'SET_SLOT', slotId: mySlot.slot_number });
          }
        }
      }
    },
    [dispatch, state.sessionId, state.slotId]
  );

  useEffect(() => {
    const src = new EventSource(SSE_URL);
    sourceRef.current = src;

    src.addEventListener('slots_update', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as SlotsSnapshot;
        onSlotsUpdate(data);
        dispatch({ type: 'SET_CONNECTED', connected: true });
      } catch (err) {
        console.error('SSE parse error', err);
      }
    });

    src.onerror = () => dispatch({ type: 'SET_CONNECTED', connected: false });
    src.onopen = () => dispatch({ type: 'SET_CONNECTED', connected: true });

    return () => {
      src.close();
    };
  }, [dispatch, onSlotsUpdate]);
}
