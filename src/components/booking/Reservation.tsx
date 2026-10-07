import { SLOT_HEIGHT } from '@/consts/booking';
import type { CreateReservationData, Reservation } from '@/services/courts';
import { User } from 'lucide-react';
import { Text } from '../design-system/Text';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { ReservationForm } from './ReservationForm';
import { useUpdateReservation } from '@/hooks/useUpdateReservation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ReservationProps {
  reservation: Reservation;
  slots: number;
}

export const ReservationComponent: React.FC<ReservationProps> = ({
  reservation,
  slots,
}) => {
  const t = useTranslations('Booking');
  const { isPending, mutateAsync: updateReservation } = useUpdateReservation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDefaultValues = () => {
    const defaultValues = {
      court: reservation.court,
      date: reservation.start,
      startTime: reservation.start.format('HH:mm'),
      endTime: reservation.start
        .add(reservation.durationMinutes, 'minute')
        .format('HH:mm'),
      description: reservation.description ?? '',
      players: reservation.players,
    };

    return reservation.coach === null
      ? {
          ...defaultValues,
          type: 'MATCH' as const,
          coach: null,
        }
      : {
          ...defaultValues,
          type: 'LESSON' as const,
          coach: reservation.coach,
        };
  };

  const handleSubmit = (data: CreateReservationData) => {
    updateReservation({
      id: reservation.id,
      ...data,
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          className="p-1 cursor-pointer"
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
              <Text variant="small">
                {t('coach', { name: reservation.coach.name })}
              </Text>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editReservation')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <ReservationForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={getDefaultValues()}
            isLoading={isPending}
            action="edit"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
