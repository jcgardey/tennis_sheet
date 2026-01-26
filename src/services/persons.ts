import type { PersonProfile } from '@/hooks/usePersons';
import api from '@/lib/api';

export interface Person {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const getAllPersonsByProfileAndName = async (
  profile: PersonProfile,
  name: string = '',
): Promise<Person[]> => {
  const res = await api.get('/persons', {
    params: { profile, name },
  });
  return res.data;
};
