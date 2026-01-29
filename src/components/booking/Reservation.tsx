import { SLOT_HEIGHT } from '@/consts/booking';
import type { Reservation } from '@/services/courts';
import { User } from 'lucide-react';
import { Text } from '../design-system/Text';

interface ReservationProps {
  reservation: Reservation;
  slots: number;
}

export const ReservationComponent: React.FC<ReservationProps> = ({
  reservation,
  slots,
}) => {
  return (
    <div
      className="p-1"
      style={{
        height: `${SLOT_HEIGHT * slots}px`,
      }}
    >
      <div
        className="h-full bg-primary/10 border text-primary rounded-lg p-3 shadow-sm flex flex-col justify-center gap-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-300"
        style={{
          color: `var(--${reservation.colorCode})`,
          borderColor: `var(--${reservation.colorCode})`,
        }}
      >
        <div className="flex items-center gap-1.5 font-bold text-sm truncate">
          <User className="w-3.5 h-3.5" />{' '}
          <Text variant="small">
            {reservation.players.length > 0
              ? reservation.players.map((player) => player.name).join(' - ')
              : reservation.description}
          </Text>
        </div>
        {reservation.coach && (
          <Text variant="small">Coach: {reservation.coach.name}</Text>
        )}
      </div>
    </div>
  );
};
