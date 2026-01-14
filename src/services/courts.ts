import api from '@/lib/api';
import dayjs, { Dayjs } from 'dayjs';

export interface Court {
  id: number;
  name: string;
}

export const getAllCourts = async (): Promise<Court[]> => {
  const res = await api.get('/courts');
  return res.data;
};

export interface Reservation {
  start: Dayjs;
  durationMinutes: number;
  description: string;
}
export interface CreateMatchData {
  start: Dayjs;
  durationMinutes: number;
  playerName: string;
  contactPhone?: string;
  courtId: number;
}

export const createMatch = async (
  matchData: CreateMatchData
): Promise<void> => {
  await api.post(`/courts/${matchData.courtId}/matches`, {
    ...matchData,
    start: matchData.start.toISOString(),
  });
};
export const getReservationsByCourtAndDate = async (
  courtId: number,
  date: Dayjs
): Promise<Reservation[]> => {
  const res = await api.get<Reservation[]>(
    `/courts/${courtId}/reservations?date=${date.format('YYYY-MM-DD')}`
  );
  return res.data.map((reservation) => ({
    ...reservation,
    start: dayjs(reservation.start),
  }));
};
