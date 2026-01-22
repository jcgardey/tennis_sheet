import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Datepicker } from '@/components/booking/DatePicker';
import { TimePicker } from '@/components/booking/TimePicker';
import { CourtSelector } from '@/components/booking/CourtCombobox';
import { type Court, type CreateReservationData } from '@/services/courts';
import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const reservationFormSchema = z
  .object({
    court: z.object({ id: z.number(), name: z.string() }).nullable(),
    date: z.custom<Dayjs>((val) => dayjs.isDayjs(val), 'Select a date.'),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time'),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time'),
    description: z.string().max(100, 'Description is too long').optional(),
    type: z.enum(['MATCH', 'LESSON']),
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
  );

export type ReservationFormData = {
  court: Court | null;
  date: Dayjs;
  startTime: string;
  endTime: string;
  description?: string;
  type: 'MATCH' | 'LESSON';
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
      description: initialData?.description || '',
      type: initialData?.type || 'MATCH',
    },
    resolver: zodResolver(reservationFormSchema),
  });

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
      courtId: data.court?.id || 0,
      start: startDateTime,
      durationMinutes: calculateDuration(data.startTime, data.endTime),
      description: data.description,
      type: data.type,
    };
    onSubmit(reservationData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-4">
      <Controller
        name="court"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Court</FieldLabel>
            <CourtSelector
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
