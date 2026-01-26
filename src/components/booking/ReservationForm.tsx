import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Datepicker } from '@/components/booking/DatePicker';
import { TimePicker } from '@/components/booking/TimePicker';
import { CourtCombobox } from '@/components/booking/CourtCombobox';
import { type Court, type CreateReservationData } from '@/services/courts';
import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlayerCombobox } from './PlayerCombobox';
import { usePersons } from '@/hooks/usePersons';
import { TSCombobox } from '../design-system/TSCombobox';
import type { Person } from '@/services/persons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const reservationFormSchema = z
  .object({
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
    type: z.enum(['MATCH', 'LESSON']),
    players: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      }),
    ),
    coach: z
      .object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      })
      .nullable(),
  })
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
  )
  .refine(
    (data) => {
      if (data.type === 'MATCH') {
        if (
          data.players.length === 0 &&
          (!data.description || data.description.trim() === '')
        ) {
          return false;
        }
      }
      return true;
    },
    {
      message:
        'Description is required when no players are selected for a match',
      path: ['description'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'MATCH') {
        return data.coach === null;
      }
      return true;
    },
    {
      message: 'Coach must not be selected for a match',
      path: ['coach'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'LESSON') {
        return data.coach !== null;
      }
      return true;
    },
    {
      message: 'Coach is required for a lesson',
      path: ['coach'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'LESSON') {
        return data.players.length > 0;
      }
      return true;
    },
    {
      message: 'At least one player is required for a lesson',
      path: ['players'],
    },
  );

export type ReservationFormData = {
  court: Court | null;
  date: Dayjs;
  startTime: string;
  endTime: string;
  description?: string;
  type: 'MATCH' | 'LESSON';
  players: Person[];
  coach: Person | null;
};

export interface ReservationFormProps {
  onSubmit: (data: CreateReservationData) => void;
  onCancel: () => void;
  initialData?: Partial<ReservationFormData>;
  isLoading: boolean;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<ReservationFormData>({
    defaultValues: {
      court: initialData?.court || null,
      date: initialData?.date || dayjs(),
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '10:00',
      description: initialData?.description,
      type: initialData?.type ?? 'MATCH',
      players: initialData?.players || [],
      coach: initialData?.coach || null,
    },
    resolver: zodResolver(reservationFormSchema),
  });

  const { persons: coaches, isLoading: isLoadingCoaches } = usePersons('COACH');

  const calculateDuration = (startTime: string, endTime: string): number => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    return endMinutes - startMinutes;
  };

  const processForm = async (data: ReservationFormData) => {
    const startDateTime = data.date
      .hour(parseInt(data.startTime.split(':')[0]))
      .minute(parseInt(data.startTime.split(':')[1]))
      .second(0)
      .millisecond(0);

    const reservationData: CreateReservationData = {
      courtId: data.court?.id as number,
      start: startDateTime,
      durationMinutes: calculateDuration(data.startTime, data.endTime),
      description: data.description,
      playerIds: data.players.map((player) => player.id),
      coachId: data.coach?.id || null,
      type: data.type,
    };
    onSubmit(reservationData);
  };

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="space-y-4 no-scrollbar overflow-y-auto max-h-[80vh]"
    >
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Reservation Type</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reservation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reservation Type</SelectLabel>
                  <SelectItem value="MATCH">Match</SelectItem>
                  <SelectItem value="LESSON">Lesson</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        name="court"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Court</FieldLabel>
            <CourtCombobox
              value={field.value}
              onValueChange={(court: Court | null) => field.onChange(court)}
            />
            <FieldError>{errors.court?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Datepicker
              date={field.value}
              onDateChange={(date) => field.onChange(date || dayjs())}
            />
            <FieldError>{errors.date?.message}</FieldError>
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <Field>
              <TimePicker
                label="Start Time"
                value={field.value}
                onChange={(time) => field.onChange(time)}
              />
              <FieldError>{errors.startTime?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <Field>
              <TimePicker
                label="End Time"
                value={field.value}
                onChange={(time) => field.onChange(time)}
              />
              <FieldError>{errors.endTime?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      <Controller
        name="players"
        control={control}
        render={({ field }) => {
          return (
            <PlayerCombobox
              value={field.value}
              onValueChange={(players: Person[]) => field.onChange(players)}
            />
          );
        }}
      />

      <Controller
        name="coach"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Coach</FieldLabel>
            <TSCombobox
              items={coaches}
              value={field.value || null}
              onValueChange={(coach: Person | null) => field.onChange(coach)}
              placeholder={
                isLoadingCoaches ? 'Loading coaches...' : 'Select a coach'
              }
              itemToStringLabel={(coach) => coach.name}
              itemToStringValue={(coach) => coach.id.toString()}
              isItemEqualToValue={(coach, anotherCoach) =>
                coach.id === anotherCoach.id
              }
              emptyMessage="No coaches found."
            />
            <FieldError>{errors.coach?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>{' '}
            <Input {...field} />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>
        )}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !isValid}>
          {isLoading ? 'Creating...' : 'New Reservation'}
        </Button>
      </div>
    </form>
  );
};
