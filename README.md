# Frontend Upgrade
## What Changed

The monolithic `index.html` (1,739 lines of inline HTML/CSS/JS) has been replaced with a modern **Next.js 16 + Tailwind CSS v4 + TypeScript** application in `smart-car-parking-frontend-next/`.

## Architecture

```
smart-car-parking-frontend-next/
├── src/
│   ├── app/                    # 6 routed pages (App Router)
│   │   ├── page.tsx            # Home / Gate Registration
│   │   ├── navigate/page.tsx   # Camera Navigation
│   │   ├── parked/page.tsx     # Parked Successfully
│   │   ├── payment/page.tsx    # VietQR Payment
│   │   ├── payment-success/    # Payment Success + Timer
│   │   ├── pay-later/page.tsx  # Pay Later Lookup
│   │   ├── layout.tsx          # Root layout + providers
│   │   └── globals.css         # Tailwind + design tokens
│   ├── components/
│   │   ├── layout/             # MobileShell, Header, ClientProviders
│   │   ├── ui/                 # Button, Card, InfoRow, QRDisplay, TimerBox
│   │   └── features/           # CameraFeed, ConnectionBadge, PlateInput
│   ├── hooks/                  # useSSE, useSocket, useTimer
│   ├── context/                # ParkingContext (useReducer)
│   ├── lib/                    # api.ts, constants.ts
│   └── types/                  # parking.ts (TypeScript interfaces)
```

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **File structure** | 1 file, 1,739 lines | 22 files, modular |
| **Framework** | None (vanilla JS) | Next.js 16 (App Router) |
| **Styling** | 975 lines inline CSS | Tailwind CSS v4 utilities |
| **Type safety** | None | Full TypeScript |
| **Routing** | DOM toggling (`display: none`) | File-based routing with real URLs |
| **State** | Global mutable `state` object | React Context + useReducer |
| **Real-time** | Global `EventSource` + `socket` | `useSSE()` + `useSocket()` hooks with cleanup |
| **Layout** | Fixed 390px phone mockup | Full-viewport mobile, centered card on desktop |
| **Build** | None | Turbopack, zero-error production build |

## Pages

All 6 screens from the original frontend are preserved with identical functionality:

| Route | Original Screen | Description |
|-------|----------------|-------------|
| `/` | S0 | Gate registration + pay-later entry |
| `/navigate` | S2 | Live camera feed + navigation info |
| `/parked` | S3 | Parking success confirmation |
| `/payment` | S4 | VietQR payment with QR code |
| `/payment-success` | S5 | Payment success + 15min exit timer |
| `/pay-later` | S6 | Session lookup by license plate |

## Visual Verification

All pages were verified at both desktop (1280px) and mobile (375px) widths:

- **Desktop**: Centered card layout (max 480px) with rounded corners and shadow
- **Mobile**: Full-screen edge-to-edge layout with no wasted space

## How to Run

```bash
# From project root
cd smart-car-parking-frontend-next
npm run dev          # → http://localhost:3000

# Backend (separate terminal)
cd smart-car-parking-backend
uvicorn app.main:app_sio --host 0.0.0.0 --port 8000 --reload
```

## Build Verification

```
✓ Compiled successfully in 2.5s
✓ TypeScript passed in 2.9s
✓ 9/9 static pages generated in 938ms
✓ Zero errors, zero warnings
```

## Backend Compatibility

The new frontend uses the **exact same API endpoints** as the original:
- `POST /start`, `POST /start/license` — session creation
- `GET /camera/stream` — MJPEG proxy
- `POST /finish` — parking confirmation
- `POST /payment`, `POST /payment/manual-finish` — payment flow
- `GET /session/lookup-by-plate` — pay-later lookup
- `GET /realtime/slots` — SSE real-time updates
- Socket.IO: `parking_successful`, `payment_successful` events

**No backend changes were needed.**
