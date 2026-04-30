// ── API base URL — backend runs on port 8000 ──────────────
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const SSE_URL = `${BASE_URL}/realtime/slots`;
export const CAM_URL = `${BASE_URL}/camera/stream`;
export const SOCKET_URL = BASE_URL;
