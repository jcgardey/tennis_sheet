import {
  SLOT_DURATION_MINUTES,
  TIME_SLOTS,
  SLOT_HEIGHT,
} from '@/consts/booking';
import type { Court, Reservation } from '@/services/courts';
import { getReservationsByCourtAndDate } from '@/services/courts';
import { useQuery } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { MapPin } from 'lucide-react';
import type React from 'react';
import { TimeSlot } from './TimeSlot';
import { ReservationComponent } from './Reservation';
import { TSAlert } from '../design-system/TSAlert';
import { ReservationSkeleton } from './ReservationSkeleton';
import { Text } from '../design-system/Text';

interface CourtGridProps {
  court: Court;
  date: Dayjs;
  onFreeSlotClick: (startTime: string, court: Court) => void;
}

export const CourtGrid: React.FC<CourtGridProps> = ({
  court,
  date,
  onFreeSlotClick,
}) => {
  const {
    data: reservations = [],
    isLoading,
    error,
  } = useQuery<Reservation[], Error>({
    queryKey: ['reservations', court.id, date.format('YYYY-MM-DD')],
    queryFn: () => getReservationsByCourtAndDate(court.id, date),
  });

  const getReservationSlots = (reservation: Reservation) =>
    reservation.durationMinutes / SLOT_DURATION_MINUTES;

  const calculateTopOffset = (reservationStartTime: Dayjs) => {
    const firstSlotTime = TIME_SLOTS[0];
    const [firstHour, firstMinute] = firstSlotTime.split(':').map(Number);
    const firstSlotMinutes = firstHour * 60 + firstMinute;

    const reservationHour = reservationStartTime.hour();
    const reservationMinute = reservationStartTime.minute();
    const reservationMinutes = reservationHour * 60 + reservationMinute;

    const minutesDifference = reservationMinutes - firstSlotMinutes;
    const slotsFromTop = minutesDifference / SLOT_DURATION_MINUTES;

    return slotsFromTop * SLOT_HEIGHT;
  };

  return (
    <div className="flex-1 min-w-[220px] border-r border-border last:border-r-0">
      <div className="h-20 bg-muted/50 border-b border-border flex flex-col items-center justify-center gap-1">
        <MapPin className="w-4 h-4 text-primary" />
        <Text variant="h4">{court.name}</Text>
      </div>

      <div className="relative">
        {isLoading && <ReservationSkeleton />}
        {!isLoading && error && (
          <div className="p-4">
            <TSAlert status="error" message="Error loading reservations" />
          </div>
        )}
        {!isLoading && !error && (
          <>
            {TIME_SLOTS.map((time, index) => (
              <TimeSlot
                key={time}
                onClick={() => onFreeSlotClick(time, court)}
                className={`${parseInt(time.split(':')[1]) === SLOT_DURATION_MINUTES && index !== TIME_SLOTS.length - 1 ? 'border-b' : ''}`}
              />
            ))}

            {reservations.map((reservation) => (
              <ReservationComponent
                reservation={reservation}
                slots={getReservationSlots(reservation)}
                timeOffset={calculateTopOffset(reservation.start)}
                key={reservation.id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
