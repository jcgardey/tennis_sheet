import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Datepicker } from '@/components/booking/DatePicker';
import { TimePicker } from '@/components/booking/TimePicker';
import { CourtCombobox } from '@/components/booking/CourtCombobox';
import { type Court, type CreateReservationData } from '@/services/courts';
import dayjs from 'dayjs';
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
import {
  ReservationFormSchema,
  type ReservationFormData,
  type ReservationInputData,
} from '@/schemas/reservationSchemas';
import { timeToMinutes } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

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
  const getDefaultValues = () => {
    const type = initialData?.type ?? 'MATCH';
    const defaultValues = {
      court: initialData?.court || null,
      date: initialData?.date || dayjs(),
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '10:00',
      description: initialData?.description,
      players: initialData?.players || [],
    };

    return type === 'MATCH'
      ? {
          ...defaultValues,
          type: 'MATCH' as const,
          coach: null,
        }
      : {
          ...defaultValues,
          type: 'LESSON' as const,
          coach: (initialData as any)?.coach || null,
        };
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    watch,
  } = useForm<ReservationInputData, unknown, ReservationFormData>({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(ReservationFormSchema),
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
      courtId: data.court.id,
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
    <form onSubmit={handleSubmit(processForm)} className="space-y-4">
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Reservation Type</FieldLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                if (val === 'MATCH') {
                  setValue('coach', null);
                }
                field.onChange(val);
              }}
            >
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
      <div className="flex gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Field className="flex-2">
              <FieldLabel>Date</FieldLabel>
              <Datepicker
                date={field.value}
                onDateChange={(date) => field.onChange(date || dayjs())}
              />
              <FieldError>{errors.date?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <Field className="flex-1">
              <TimePicker
                label="Start"
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
            <Field className="flex-1">
              <TimePicker
                label="End"
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

      {watch('type') === 'LESSON' && (
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
      )}

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
