import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Datepicker } from '@/components/booking/DatePicker';
import { TimePicker } from '@/components/booking/TimePicker';
import { CourtSelector } from '@/components/booking/CourtSelector';
import { type CreateMatchData } from '@/services/courts';
import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';
import { Field, FieldLabel } from '../ui/field';

const matchFormSchema = z.object({
  courtId: z.number().min(1, 'Seleccione una cancha'),
  date: z.custom<Dayjs>((val) => dayjs.isDayjs(val), 'Fecha requerida'),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio inválida'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin inválida'),
  playerName: z
    .string()
    .min(1, 'Nombre del jugador requerido')
    .max(100, 'Nombre muy largo'),
  contactPhone: z.string().optional(),
});

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
  const [formData, setFormData] = React.useState<MatchFormData>({
    courtId: initialData?.courtId || 0,
    date: initialData?.date || dayjs(),
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '10:00',
    playerName: initialData?.playerName || '',
    contactPhone: initialData?.contactPhone || '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      matchFormSchema.parse(formData);

      // Additional validation for time logic
      const startMinutes = timeToMinutes(formData.startTime);
      const endMinutes = timeToMinutes(formData.endTime);

      if (endMinutes <= startMinutes) {
        setErrors({
          endTime: 'La hora de fin debe ser posterior a la hora de inicio',
        });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateDuration = (): number => {
    const startMinutes = timeToMinutes(formData.startTime);
    const endMinutes = timeToMinutes(formData.endTime);
    return endMinutes - startMinutes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const duration = calculateDuration();
    const startDateTime = formData.date
      .hour(parseInt(formData.startTime.split(':')[0]))
      .minute(parseInt(formData.startTime.split(':')[1]));

    const matchData: CreateMatchData = {
      courtId: formData.courtId,
      start: startDateTime.toISOString(),
      durationMinutes: duration,
      playerName: formData.playerName,
      contactPhone: formData.contactPhone || undefined,
    };

    try {
      onSubmit(matchData);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel>Cancha</FieldLabel>
        <CourtSelector
          value={formData.courtId || undefined}
          onValueChange={(courtId: number) =>
            setFormData((prev) => ({ ...prev, courtId }))
          }
        />
        {errors.courtId && (
          <span className="text-red-500 text-sm">{errors.courtId}</span>
        )}
      </Field>

      <Field>
        <FieldLabel>Fecha</FieldLabel>
        <Datepicker
          date={formData.date}
          onDateChange={(date) =>
            setFormData((prev) => ({ ...prev, date: date || dayjs() }))
          }
        />
        {errors.date && (
          <span className="text-red-500 text-sm">{errors.date}</span>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <TimePicker
            label="Hora de inicio"
            value={formData.startTime}
            onChange={(time) =>
              setFormData((prev) => ({ ...prev, startTime: time }))
            }
          />
          {errors.startTime && (
            <span className="text-red-500 text-sm">{errors.startTime}</span>
          )}
        </Field>

        <Field>
          <TimePicker
            label="Hora de fin"
            value={formData.endTime}
            onChange={(time) =>
              setFormData((prev) => ({ ...prev, endTime: time }))
            }
          />
          {errors.endTime && (
            <span className="text-red-500 text-sm">{errors.endTime}</span>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="playerName">Nombre del jugador</FieldLabel>
        <Input
          id="playerName"
          type="text"
          value={formData.playerName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, playerName: e.target.value }))
          }
          placeholder="Ej: Juan Pérez"
          required
        />
        {errors.playerName && (
          <span className="text-red-500 text-sm">{errors.playerName}</span>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="contactPhone">
          Teléfono de contacto (opcional)
        </FieldLabel>
        <Input
          id="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))
          }
          placeholder="Ej: +54 11 1234-5678"
        />
        {errors.contactPhone && (
          <span className="text-red-500 text-sm">{errors.contactPhone}</span>
        )}
      </Field>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Reserva'}
        </Button>
      </div>
    </form>
  );
};
