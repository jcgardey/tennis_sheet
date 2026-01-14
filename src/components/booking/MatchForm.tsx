import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Datepicker } from '@/components/booking/DatePicker';
import { TimePicker } from '@/components/booking/TimePicker';
import { CourtSelector } from '@/components/booking/CourtSelector';
import { type CreateMatchData } from '@/services/courts';
import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const matchFormSchema = z
  .object({
    courtId: z.number().min(1, 'Select a court.'),
    date: z.custom<Dayjs>((val) => dayjs.isDayjs(val), 'Select a date.'),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time'),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time'),
    playerName: z
      .string()
      .min(1, 'Player name is required')
      .max(100, 'Player name is too long'),
    contactPhone: z.string().optional(),
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
    }
  );

export type MatchFormData = {
  courtId: number;
  date: Dayjs;
  startTime: string;
  endTime: string;
  playerName: string;
  contactPhone?: string;
};

export interface MatchFormProps {
  onSubmit: (data: CreateMatchData) => void;
  onCancel: () => void;
  initialData?: Partial<MatchFormData>;
  isLoading: boolean;
}

export const MatchForm: React.FC<MatchFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<MatchFormData>({
    defaultValues: {
      courtId: initialData?.courtId || 0,
      date: initialData?.date || dayjs(),
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '10:00',
      playerName: initialData?.playerName || '',
      contactPhone: initialData?.contactPhone || '',
    },
    resolver: zodResolver(matchFormSchema),
  });

  const calculateDuration = (startTime: string, endTime: string): number => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    return endMinutes - startMinutes;
  };

  const processForm = async (data: MatchFormData) => {
    const startDateTime = data.date
      .hour(parseInt(data.startTime.split(':')[0]))
      .minute(parseInt(data.startTime.split(':')[1]))
      .second(0)
      .millisecond(0);

    const matchData: CreateMatchData = {
      courtId: data.courtId,
      start: startDateTime.toISOString(),
      durationMinutes: calculateDuration(data.startTime, data.endTime),
      playerName: data.playerName,
      contactPhone: data.contactPhone || undefined,
    };
    onSubmit(matchData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-4">
      <Controller
        name="courtId"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Court</FieldLabel>
            <CourtSelector
              value={field.value || undefined}
              onValueChange={(courtId: number) => field.onChange(courtId)}
            />
            <FieldError>{errors.courtId?.message}</FieldError>
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
        name="playerName"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="playerName">Description</FieldLabel>{' '}
            <Input {...field} />
            <FieldError>{errors.playerName?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        name="contactPhone"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="contactPhone">
              Contact Phone (optional)
            </FieldLabel>{' '}
            <Input {...field} />{' '}
            <FieldError>{errors.contactPhone?.message}</FieldError>
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
