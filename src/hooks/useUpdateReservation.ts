import {
  updateReservation,
  type UpdateReservationData,
} from '@/services/courts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateReservationData) => updateReservation(data),
    onSuccess: (_, dataSent) => {
      queryClient.invalidateQueries({
        queryKey: ['reservations', dataSent.courtId],
      });
      toast.success('Reservation updated successfully', {
        description: dataSent.start.format('dddd, MMMM DD, YYYY [at] H:mm'),
      });
    },
    onError: () => {
      toast.error('Failed to update reservation.');
    },
  });
};
