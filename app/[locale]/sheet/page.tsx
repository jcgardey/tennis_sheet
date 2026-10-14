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
    <div className="mx-auto space-y-6">
      <Text variant="h1">{t('title')}</Text>
      {courts === null ? (
        <TSAlert status="error" message={t('errorLoadingCourts')} />
      ) : courts.length === 0 ? (
        <TSAlert status="warning" message={t('noCourts')} />
      ) : (
        <BookingSheet courts={courts} />
      )}
    </div>
  );
}
