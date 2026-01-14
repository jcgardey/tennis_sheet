import { SLOT_HEIGHT } from '@/consts/booking';
import type { Reservation } from '@/services/courts';
import { User } from 'lucide-react';

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
        className="h-full bg-primary/10 border border-primary/30 text-primary rounded-lg p-3 shadow-sm flex flex-col justify-center gap-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-300"
        style={{
          backgroundColor: `var(--${reservation.colorCode})`,
          color: `var(--${reservation.colorCode}-foreground)`,
          borderColor: `var(--${reservation.colorCode}-foreground)`,
        }}
      >
        <div className="flex items-center gap-1.5 font-bold text-sm truncate">
          <User className="w-3.5 h-3.5" /> {reservation.description}
        </div>
        <div className="text-[10px] font-medium opacity-80 uppercase">
          {reservation.durationMinutes / 60} h
        </div>
      </div>
    </div>
  );
};
