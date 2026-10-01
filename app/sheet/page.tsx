import { Text } from '@/components/design-system/Text';
import { TSAlert } from '@/components/design-system/TSAlert';
import BookingSheet from '@/components/booking/BookingSheet';
import { getAllCourts } from '@/services/server/courts';

export const dynamic = 'force-dynamic';

export default async function BookingSheetPage() {
  const courts = await getAllCourts().catch(() => null);

  return (
    <div className="min-h-screen font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 border-b border-border pb-4">
          <Text variant="h1">Reservas</Text>
        </div>
        {courts === null ? (
          <TSAlert status="error" message="Error while loading courts" />
        ) : courts.length === 0 ? (
          <TSAlert status="warning" message="No courts available" />
        ) : (
          <BookingSheet courts={courts} />
        )}
      </div>
    </div>
  );
}
