import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '../ui/field';

export interface TimePickerProps {
  value: string; // Format: "HH:mm"
  onChange: (time: string) => void;
  label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input
        type="time"
        value={value}
        onChange={handleChange}
        step="900" // 15 minute increments
      />
    </Field>
  );
};
