import type { Court } from '@/services/courts';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Text } from '../design-system/Text';
import CourtReservations from './CourtReservations';

interface CourtGridProps {
  court: Court;
  date: Date;
  onFreeSlotClick: (startTime: string, court: Court) => void;
  className?: string;
}

export default function CourtGrid({
  court,
  date,
  onFreeSlotClick,
  className,
}: CourtGridProps) {
  return (
    <div
      className={cn(
        'flex-1 min-w-[220px] border-r border-border last:border-r-0',
        className,
      )}
    >
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
