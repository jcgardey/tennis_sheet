import { getAllPersonsByProfileAndName } from '@/services/persons';
import { useQuery } from '@tanstack/react-query';

export type PersonProfile = 'PLAYER' | 'COACH';

export const usePersons = (profile: PersonProfile = 'PLAYER', name = '') => {
  const { data: persons = [], ...others } = useQuery({
    queryKey: ['persons', profile, name],
    queryFn: () => getAllPersonsByProfileAndName(profile, name),
  });
  return { persons, ...others };
};
