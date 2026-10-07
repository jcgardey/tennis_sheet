import { useQuery } from '@tanstack/react-query';
import { getAllCourts, type Court } from '@/services/courts';
import { TSCombobox } from '../design-system/TSCombobox';
import { useTranslations } from 'next-intl';

export interface CourtSelectorProps {
  value: Court | null;
  onValueChange: (court: Court | null) => void;
}

export const CourtCombobox: React.FC<CourtSelectorProps> = ({
  value,
  onValueChange,
}) => {
  const t = useTranslations('Booking');
  const { data: courts = [], isLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: getAllCourts,
  });

  return (
    <TSCombobox
      items={courts}
      value={value}
      onValueChange={onValueChange}
      placeholder={isLoading ? t('loadingCourts') : t('selectCourt')}
      itemToStringLabel={(court) => court.name}
      itemToStringValue={(court) => court.id.toString()}
      isItemEqualToValue={(court, anotherCourt) => court.id === anotherCourt.id}
      emptyMessage={t('noCourtsFound')}
    />
  );
};
