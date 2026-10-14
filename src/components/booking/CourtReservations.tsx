import { useQuery } from '@tanstack/react-query';
import { TSAlert } from '../design-system/TSAlert';
import {
  getReservationsByCourtAndDate,
  type Court,
  type Reservation,
} from '@/services/courts';
import { ReservationSkeleton } from './ReservationSkeleton';
import {
  SLOT_DURATION_MINUTES,
  SLOT_HEIGHT,
  TIME_SLOTS,
} from '@/consts/booking';
import { TimeSlot } from './TimeSlot';
import { ReservationComponent } from './Reservation';
import type { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

interface CourtReservationsProps {
  court: Court;
  date: Dayjs;
  onFreeSlotClick: (startTime: string, court: Court) => void;
}

export default function CourtReservations({
  court,
  date,
  onFreeSlotClick,
}: CourtReservationsProps) {
  const {
    data: reservations = [],
    isLoading,
    error,
  } = useQuery<Reservation[], Error>({
    queryKey: ['reservations', court.id, date.format('YYYY-MM-DD')],
    queryFn: () => getReservationsByCourtAndDate(court.id, date),
  });
  const t = useTranslations('Booking');

  const getReservationSlots = (reservation: Reservation) =>
    reservation.durationMinutes / SLOT_DURATION_MINUTES;

  const calculateTopOffset = (reservationStartTime: Dayjs) => {
    const firstSlotTime = TIME_SLOTS[0];
    const [firstHour, firstMinute] = firstSlotTime.split(':').map(Number);
    const firstSlotMinutes = firstHour * 60 + firstMinute;

    const reservationHour = reservationStartTime.hour();
    const reservationMinutes =
      reservationHour * 60 + reservationStartTime.minute();

    const minutesDifference = reservationMinutes - firstSlotMinutes;
    const slotsFromTop = minutesDifference / SLOT_DURATION_MINUTES;

    return slotsFromTop * SLOT_HEIGHT;
  };

  if (isLoading) {
    return <ReservationSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4">
        <TSAlert status="error" message={t('errorLoadingReservations')} />
      </div>
    );
  }

  return (
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
  );
}
