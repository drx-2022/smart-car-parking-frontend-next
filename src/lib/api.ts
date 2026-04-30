import { BASE_URL } from './constants';
import type {
  StartResponse,
  PaymentResponse,
  SessionLookupResponse,
  GenericResponse,
} from '@/types/parking';

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── POST /start ────────────────────────────────────────────
export function startSession(cameraUrl: string) {
  return request<StartResponse>('POST', '/start', {
    camera_url: cameraUrl,
    frame_base64: null,
    slot_id: null,
  });
}

// ── POST /start/license ────────────────────────────────────
export function updateLicense(originalPlate: string, confirmedPlate: string) {
  return request<GenericResponse>('POST', '/start/license', {
    original_plate: originalPlate,
    confirmed_plate: confirmedPlate,
  });
}

// ── POST /finish ───────────────────────────────────────────
export function finishParking(sessionId: string, slotId?: string) {
  return request<GenericResponse>('POST', '/finish', {
    session_id: sessionId,
    selected_slot_id: slotId || null,
  });
}

// ── POST /payment ──────────────────────────────────────────
export function startPayment(sessionId: string) {
  return request<PaymentResponse>('POST', '/payment', {
    session_id: sessionId,
    payment_method: 'vietqr',
  });
}

// ── POST /payment/manual-finish ────────────────────────────
export function manualPaymentFinish(sessionId: string) {
  return request<GenericResponse>('POST', '/payment/manual-finish', {
    session_id: sessionId,
    payment_method: 'vietqr',
  });
}

// ── GET /session/lookup-by-plate ───────────────────────────
export async function lookupSessionByPlate(plate: string) {
  const res = await fetch(
    `${BASE_URL}/session/lookup-by-plate?plate=${encodeURIComponent(plate)}`
  );
  return res.json() as Promise<SessionLookupResponse>;
}
