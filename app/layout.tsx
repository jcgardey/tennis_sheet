// app/layout.tsx
import type { Metadata } from 'node_modules/next/types'; // o usa el import estándar de Next
import '@/styles.css';

export const metadata: Metadata = {
  title: 'Tennis Sheet',
  description: 'A web app to manage tennis courts reservations and schedules.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
