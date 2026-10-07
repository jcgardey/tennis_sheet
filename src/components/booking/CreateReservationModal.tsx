import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReservationForm } from './ReservationForm';
import type { CreateReservationData } from '@/services/courts';
import type { ReservationInputData } from '@/schemas/reservationSchemas';
import { ScrollArea } from '../ui/scroll-area';
import { Text } from '../design-system/Text';
import type { DialogProps } from '@radix-ui/react-dialog';
import { useTranslations } from 'next-intl';

export interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: DialogProps['onOpenChange'];
  onCreateReservation: (data: CreateReservationData) => void;
  initialData?: Partial<ReservationInputData>;
  isLoading: boolean;
}

export const CreateReservationModal: React.FC<CreateReservationModalProps> = ({
  isOpen,
  onClose,
  onCreateReservation,
  initialData,
  isLoading,
}) => {
  const t = useTranslations('Booking');
  const handleCancel = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const handleSubmit = (data: CreateReservationData) => {
    onCreateReservation(data);
    handleCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen">
        <DialogHeader>
          <DialogTitle asChild>
            <Text variant="h2">{t('newReservation')}</Text>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <ReservationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
            isLoading={isLoading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
