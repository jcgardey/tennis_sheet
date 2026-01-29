import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReservationForm } from './ReservationForm';
import type { CreateReservationData } from '@/services/courts';
import type { ReservationFormData } from '@/schemas/reservationSchemas';
import { ScrollArea } from '../ui/scroll-area';
import { Text } from '../design-system/Text';

export interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReservation: (data: CreateReservationData) => void;
  initialData?: Partial<ReservationFormData>;
  isLoading: boolean;
}

export const CreateReservationModal: React.FC<CreateReservationModalProps> = ({
  isOpen,
  onClose,
  onCreateReservation,
  initialData,
  isLoading,
}) => {
  const handleSubmit = (data: CreateReservationData) => {
    onCreateReservation(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen">
        <DialogHeader>
          <DialogTitle asChild>
            <Text variant="h2">New Reservation</Text>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <ReservationForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={initialData}
            isLoading={isLoading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
