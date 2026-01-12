import { createMatch, type CreateMatchData } from '@/services/courts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMatchData) => createMatch(data),
    onSuccess: (_, dataSent) => {
      queryClient.invalidateQueries({
        queryKey: ['reservations', dataSent.courtId],
      });
    },
  });
};
