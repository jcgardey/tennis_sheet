import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReservationForm, type ReservationFormData } from './ReservationForm';
import type { CreateReservationData } from '@/services/courts';

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Reservation</DialogTitle>
        </DialogHeader>
        <ReservationForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialData}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
