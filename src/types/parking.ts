// ── Slot data from SSE ─────────────────────────────────────
export interface SlotInfo {
  id: string;           // Supabase UUID
  slot_number: string;
  is_occupied: boolean;
  lot_id?: string;
}

export interface ActiveSession {
  id: string;
  slot_id: string | null;
  license_plate: string | null;
  start_time: string | null;
  end_time: string | null;
  is_completed: boolean;
  is_paid: boolean;
  forced_target_slot: string | null;
}

export interface SlotsSnapshot {
  timestamp: string;
  slots: SlotInfo[];
  active_sessions: ActiveSession[];
}

// ── API request/response ───────────────────────────────────
export interface StartResponse {
  session_id: string;
  license_plate: string | null;
  source: string;
  camera_stream_url: string;
}

export interface PaymentResponse {
  fee: number;
  content: string;
  qr_url: string;
}

export interface SessionLookupResponse {
  found: boolean;
  session_id: string | null;
  license_plate: string | null;
  slot_id: string | null;
  slot_number: string | null;
  start_time: string | null;
  is_paid: boolean;
}

export interface GenericResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// ── App state ──────────────────────────────────────────────
export interface ParkingState {
  plate: string;
  sessionId: string | null;
  slotId: string | null;
  fee: number | null;
  payContent: string | null;
  parkStart: number | null;
  connected: boolean;
  slotData: Record<string, { uuid: string; occupied: boolean }>;
}

export type ParkingAction =
  | { type: 'SET_PLATE'; plate: string }
  | { type: 'SET_SESSION'; sessionId: string }
  | { type: 'SET_SLOT'; slotId: string }
  | { type: 'SET_PAYMENT'; fee: number; content: string }
  | { type: 'SET_PARK_START'; time: number }
  | { type: 'SET_CONNECTED'; connected: boolean }
  | { type: 'UPDATE_SLOTS'; slotData: Record<string, { uuid: string; occupied: boolean }> }
  | { type: 'RESET' };
