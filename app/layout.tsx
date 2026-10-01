import type { Metadata } from 'next';
import '@/styles.css';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import AppProviders from '@/components/providers/AppProviders';

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
      <body>
        <NavigationBar />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
