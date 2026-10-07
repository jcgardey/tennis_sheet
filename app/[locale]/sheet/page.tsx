import { Text } from '@/components/design-system/Text';
import { TSAlert } from '@/components/design-system/TSAlert';
import BookingSheet from '@/components/booking/BookingSheet';
import { getAllCourts } from '@/services/server/courts';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function BookingSheetPage() {
  const [courts, t] = await Promise.all([
    getAllCourts().catch(() => null),
    getTranslations('Booking'),
  ]);

  return (
    <div className="min-h-screen font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 border-b border-border pb-4">
          <Text variant="h1">{t('title')}</Text>
        </div>
        {courts === null ? (
          <TSAlert status="error" message={t('errorLoadingCourts')} />
        ) : courts.length === 0 ? (
          <TSAlert status="warning" message={t('noCourts')} />
        ) : (
          <BookingSheet courts={courts} />
        )}
      </div>
    </div>
  );
}