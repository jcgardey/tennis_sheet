import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface TimePickerProps {
  value: string // Format: "HH:mm"
  onChange: (time: string) => void
  label?: string
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Input
        type="time"
        value={value}
        onChange={handleChange}
        step="900" // 15 minute increments
      />
    </div>
  )
}