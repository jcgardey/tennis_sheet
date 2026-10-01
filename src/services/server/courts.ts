import { apiFetch } from '@/lib/server/api';
import type { Court } from '@/services/courts';

export const getAllCourts = async (): Promise<Court[]> => {
  const response = await apiFetch('/api/courts');
  if (!response.ok) {
    throw new Error(`Spring API request failed with status ${response.status}`);
  }
  return response.json();
};
