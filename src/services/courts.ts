import api from '@/lib/api';
import { format } from 'date-fns';
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
  start: Date;
  durationMinutes: number;
  description: string;
  colorCode: string;
  players: Person[];
  coach: Person | null;
  court: Court;
}

export interface CreateReservationData {
  start: Date;
  durationMinutes: number;
  description?: string;
  courtId: number;
  coachId: number | null;
  playerIds: number[];
  type: 'MATCH' | 'LESSON';
}

export interface UpdateReservationData {
  id: number;
  start: Date;
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
  date: Date,
): Promise<Reservation[]> => {
  const res = await api.get<Reservation[]>(
    `/courts/${courtId}/reservations?date=${format(date, 'yyyy-MM-dd')}`,
  );
  return res.data.map((reservation) => ({
    ...reservation,
    start: new Date(reservation.start),
  }));
};

export const updateReservation = async (
  data: UpdateReservationData,
): Promise<Reservation> => {
  const response = await api.put<Reservation>(`/reservations/${data.id}`, {
    ...data,
    start: data.start.toISOString(),
  });
  return {
    ...response.data,
    start: new Date(response.data.start),
  };
};
