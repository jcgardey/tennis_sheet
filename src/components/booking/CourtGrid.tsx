import { SLOT_DURATION_MINUTES, TIME_SLOTS } from '@/consts/booking';
import type { Court, Reservation } from '@/services/courts';
import { getReservationsByCourtAndDate } from '@/services/courts';
import { useQuery } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { MapPin } from 'lucide-react';
import type React from 'react';
import { FreeSlots } from './FreeSlots';
import { ReservationComponent } from './Reservation';
import { TSAlert } from '../design-system/TSAlert';
import { ReservationSkeleton } from './ReservationSkeleton';

interface CourtGridProps {
  court: Court;
  date: Dayjs;
  onFreeSlotClick: (startTime: string, courtId: number) => void;
}

const getTime = (date: Dayjs) => date.format('HH:mm');

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

  const renderedSlots = new Set();

  const getReservation = (time: string) =>
    reservations.find((r) => getTime(r.start) === time);
  const getReservationSlots = (reservation: Reservation) =>
    reservation.durationMinutes / SLOT_DURATION_MINUTES;

  const getAvailableDuration = (startTime: string) => {
    const startIndex = TIME_SLOTS.indexOf(startTime);
    let duration = 0;
    for (let i = startIndex; i < TIME_SLOTS.length; i++) {
      const time = TIME_SLOTS[i];
      const hasRes = reservations.find((r) => getTime(r.start) === time);
      const isOccupiedByPrior = reservations.some((r) => {
        const startIdx = TIME_SLOTS.indexOf(getTime(r.start));
        const currentIdx = TIME_SLOTS.indexOf(time);
        return (
          currentIdx > startIdx &&
          currentIdx < startIdx + getReservationSlots(r)
        );
      });
      if (hasRes || isOccupiedByPrior) break;
      duration++;
    }
    return duration;
  };

  return (
    <div className="flex-1 min-w-[220px] border-r border-border last:border-r-0">
      {/* Header de Cancha */}
      <div className="h-20 bg-muted/50 border-b border-border flex flex-col items-center justify-center gap-1">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">{court.name}</span>
      </div>

      {/* Slots de Tiempo */}
      <div className="relative">
        {isLoading && <ReservationSkeleton />}
        {!isLoading && error && (
          <div className="p-4">
            <TSAlert status="error" message="Error loading reservations" />
          </div>
        )}
        {!isLoading &&
          !error &&
          reservations &&
          TIME_SLOTS.map((time) => {
            if (renderedSlots.has(time)) return null;

            const res = getReservation(time);
            if (res) {
              // Marcar slots ocupados
              for (let j = 0; j < getReservationSlots(res); j++) {
                renderedSlots.add(TIME_SLOTS[TIME_SLOTS.indexOf(time) + j]);
              }
              return (
                <ReservationComponent
                  key={time}
                  reservation={res}
                  slots={getReservationSlots(res)}
                />
              );
            }

            // Manejo de bloques libres
            const freeSlots = getAvailableDuration(time);
            for (let j = 0; j < freeSlots; j++) {
              renderedSlots.add(TIME_SLOTS[TIME_SLOTS.indexOf(time) + j]);
            }

            return (
              <FreeSlots
                key={time}
                size={freeSlots}
                onClick={() => onFreeSlotClick(time, court.id)}
              />
            );
          })}
      </div>
    </div>
  );
};
