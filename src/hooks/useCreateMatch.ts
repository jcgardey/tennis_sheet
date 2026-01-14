import { createMatch, type CreateMatchData } from '@/services/courts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMatchData) => createMatch(data),
    onSuccess: (_, dataSent) => {
      queryClient.invalidateQueries({
        queryKey: ['reservations', dataSent.courtId],
      });
      toast.success('Reservation created successfully', {
        description: dataSent.start.format('dddd, MMMM DD, YYYY [at] H:mm'),
      });
    },
    onError: () => {
      toast.error('Failed to create reservation. Please try again.');
    },
  });
};
