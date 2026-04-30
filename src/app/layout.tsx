import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ParkingProvider } from '@/context/ParkingContext';
import ClientProviders from '@/components/layout/ClientProviders';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Smart Parking – Bãi Xe Thông Minh',
  description: 'Hệ thống đỗ xe thông minh với AI phát hiện vị trí trống và dẫn đường tự động.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ParkingProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ParkingProvider>
      </body>
    </html>
  );
}
