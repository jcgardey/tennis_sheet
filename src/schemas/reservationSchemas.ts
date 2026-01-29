import { timeToMinutes } from '@/lib/utils';
import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const BaseReservationSchema = z.object({
  court: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .refine((val) => val !== null, {
      message: 'Please select a court',
    }),
  date: z.custom<Dayjs>((val) => dayjs.isDayjs(val), 'Select a date.'),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time'),
  description: z.string().max(100, 'Description is too long').optional(),
  players: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
  ),
});

const MatchSchema = BaseReservationSchema.extend({
  type: z.literal('MATCH'),
  coach: z.null(),
}).refine(
  (data) => {
    if (
      data.players.length === 0 &&
      (!data.description || data.description.trim() === '')
    ) {
      return false;
    }
    return true;
  },
  {
    message: 'Description is required when no players are selected for a match',
    path: ['description'],
  },
);

const LessonSchema = BaseReservationSchema.extend({
  type: z.literal('LESSON'),
  coach: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
}).refine((data) => data.players.length > 0, {
  message: 'At least one player is required for a lesson',
  path: ['players'],
});

export const ReservationFormSchema = z
  .discriminatedUnion('type', [MatchSchema, LessonSchema])
  .refine(
    (data) => {
      const startMinutes = timeToMinutes(data.startTime);
      const endMinutes = timeToMinutes(data.endTime);
      return endMinutes > startMinutes;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    },
  );

export type ReservationFormData = z.infer<typeof ReservationFormSchema>;
export type ReservationInputData = z.input<typeof ReservationFormSchema>;
