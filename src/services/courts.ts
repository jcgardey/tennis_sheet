import api from '@/lib/api';
import dayjs, { Dayjs } from 'dayjs';
import type { Person } from './persons';

export interface Court {
  id: number;
  name: string;
}

export const getAllCourts = async (): Promise<Court[]> => {
  const res = await api.get('/courts');
  return res.data;
};

export interface Reservation {
  id: number;
  start: Dayjs;
  durationMinutes: number;
  description: string;
  colorCode: string;
  players: Person[];
  coach: Person | null;
  court: Court;
}

export interface CreateReservationData {
  start: Dayjs;
  durationMinutes: number;
  description?: string;
  courtId: number;
  coachId: number | null;
  playerIds: number[];
  type: 'MATCH' | 'LESSON';
}

export interface UpdateReservationData {
  id: number;
  start: Dayjs;
  durationMinutes: number;
  description?: string;
  courtId: number;
  coachId: number | null;
  playerIds: number[];
}

export const createReservation = async (
  reservationData: CreateReservationData,
): Promise<void> => {
  await api.post(`/courts/${reservationData.courtId}/reservations`, {
    ...reservationData,
    start: reservationData.start.toISOString(),
  });
};

export const getReservationsByCourtAndDate = async (
  courtId: number,
  date: Dayjs,
): Promise<Reservation[]> => {
  const res = await api.get<Reservation[]>(
    `/courts/${courtId}/reservations?date=${date.format('YYYY-MM-DD')}`,
  );
  return res.data.map((reservation) => ({
    ...reservation,
    start: dayjs(reservation.start),
  }));
};

export const updateReservation = async (
  data: UpdateReservationData,
): Promise<Reservation> => {
  return await api.put(`/reservations/${data.id}`, {
    ...data,
    start: data.start.toISOString(),
  });
};
