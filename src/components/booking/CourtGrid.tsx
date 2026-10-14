import type { Court } from '@/services/courts';
import { MapPin } from 'lucide-react';
import { Text } from '../design-system/Text';
import CourtReservations from './CourtReservations';

interface CourtGridProps {
  court: Court;
  date: Date;
  onFreeSlotClick: (startTime: string, court: Court) => void;
}

export default function CourtGrid({
  court,
  date,
  onFreeSlotClick,
}: CourtGridProps) {
  return (
    <div className="flex-1 min-w-[220px] border-r border-border last:border-r-0">
      <div className="h-20 border-b border-border flex flex-col items-center justify-center gap-1">
        <MapPin className="w-4 h-4 text-primary" />
        <Text variant="h4">{court.name}</Text>
      </div>

      <div className="relative">
        <CourtReservations
          court={court}
          date={date}
          onFreeSlotClick={onFreeSlotClick}
        />
      </div>
    </div>
  );
}
