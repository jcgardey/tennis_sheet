import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MatchForm, type MatchFormData } from './MatchForm';
import type { CreateMatchData } from '@/services/courts';

export interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMatch: (data: CreateMatchData) => void;
  initialData?: Partial<MatchFormData>;
  isLoading: boolean;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  onCreateMatch,
  initialData,
  isLoading,
}) => {
  const handleSubmit = (data: CreateMatchData) => {
    onCreateMatch(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
        </DialogHeader>
        <MatchForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialData}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
