import {
  SLOT_DURATION_MINUTES,
  SLOT_HEIGHT,
  TIME_SLOTS,
} from '@/consts/booking';
import type { Court, Reservation } from '@/services/courts';
import { getReservationsByCourtAndDate } from '@/services/courts';
import { useQuery } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { CheckCircle2, MapPin, User } from 'lucide-react';
import type React from 'react';

interface CourtGridProps {
  court: Court;
  date: Dayjs;
}

const getTime = (date: Dayjs) => date.format('HH:mm');

export const CourtGrid: React.FC<CourtGridProps> = ({ court, date }) => {
  const {
    data: reservations = [],
    isLoading,
    error,
  } = useQuery<Reservation[], Error>({
    queryKey: ['reservations', court.id, date.format('YYYY-MM-DD')],
    queryFn: () => getReservationsByCourtAndDate(court.id, date),
  });

  const renderedSlots = new Set();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 min-w-[220px] border-r border-border last:border-r-0">
        <div className="h-20 bg-muted/50 border-b border-border flex flex-col items-center justify-center gap-1">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">{court.name}</span>
        </div>
        <div className="p-4 text-center text-muted-foreground text-sm">
          Cargando reservas...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 min-w-[220px] border-r border-border last:border-r-0">
        <div className="h-20 bg-muted/50 border-b border-border flex flex-col items-center justify-center gap-1">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">{court.name}</span>
        </div>
        <div className="p-4 text-center text-destructive text-sm">
          Error: {error.message}
        </div>
      </div>
    );
  }

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
        {TIME_SLOTS.map((time) => {
          if (renderedSlots.has(time)) return null;

          const res = getReservation(time);
          if (res) {
            // Marcar slots ocupados
            for (let j = 0; j < getReservationSlots(res); j++) {
              renderedSlots.add(TIME_SLOTS[TIME_SLOTS.indexOf(time) + j]);
            }
            return (
              <div
                key={time}
                className="p-1 border-b border-border"
                style={{
                  height: `${SLOT_HEIGHT * getReservationSlots(res)}px`,
                }}
              >
                <div className="h-full bg-primary/10 border border-primary/30 text-primary rounded-lg p-3 shadow-sm flex flex-col justify-center gap-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="flex items-center gap-1.5 font-bold text-sm truncate">
                    <User className="w-3.5 h-3.5" /> {res.description}
                  </div>
                  <div className="text-[10px] font-medium opacity-80 uppercase">
                    {res.durationMinutes / 60} h
                  </div>
                </div>
              </div>
            );
          }

          // Manejo de bloques libres
          const freeSlots = getAvailableDuration(time);
          for (let j = 0; j < freeSlots; j++) {
            renderedSlots.add(TIME_SLOTS[TIME_SLOTS.indexOf(time) + j]);
          }

          return (
            <div
              key={time}
              className="p-1 border-b border-border"
              style={{ height: `${SLOT_HEIGHT * freeSlots}px` }}
            >
              <button className="w-full h-full group flex flex-col items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-150 cursor-pointer">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary/60 transition-colors" />
                {freeSlots > 1 && (
                  <span className="text-[10px] text-muted-foreground/40 group-hover:text-primary/60 mt-1">
                    {freeSlots * 30} min libres
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
