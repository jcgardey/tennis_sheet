import {
  createReservation,
  type CreateReservationData,
} from '@/services/courts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations('Notifications');
  return useMutation({
    mutationFn: (data: CreateReservationData) => createReservation(data),
    onSuccess: (_, dataSent) => {
      queryClient.invalidateQueries({
        queryKey: ['reservations', dataSent.courtId],
      });
      toast.success(t('created'), {
        description: new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          month: 'long',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }).format(dataSent.start.toDate()),
      });
    },
    onError: () => {
      toast.error(t('createFailed'));
    },
  });
};
