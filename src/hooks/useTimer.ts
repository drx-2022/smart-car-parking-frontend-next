'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * Count-up timer (from startTime) — used for parking duration.
 */
export function useCountUp(startTime: number | null) {
  const [display, setDisplay] = useState('00:00');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!startTime) {
      setDisplay('00:00');
      return;
    }
    const tick = () => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      setDisplay(`${pad(Math.floor(s / 60))}:${pad(s % 60)}`);
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime]);

  return display;
}

/**
 * Countdown timer (from totalSeconds) — used for exit window.
 */
export function useCountDown(totalSeconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setRemaining(totalSeconds);
      return;
    }
    setRemaining(totalSeconds);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0 && intervalRef.current) clearInterval(intervalRef.current);
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, totalSeconds]);

  const display = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;
  return { remaining, display };
}

/**
 * Duration string from a start time: "X phút Y giây"
 */
export function useDuration(startTime: number | null): string {
  const [dur, setDur] = useState('–');

  const update = useCallback(() => {
    if (!startTime) { setDur('–'); return; }
    const s = Math.floor((Date.now() - startTime) / 1000);
    setDur(`${Math.floor(s / 60)} phút ${s % 60} giây`);
  }, [startTime]);

  useEffect(() => {
    update();
  }, [update]);

  return dur;
}
