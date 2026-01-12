'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

interface DatepickerProps {
  date: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}

export const Datepicker: React.FC<DatepickerProps> = ({
  date,
  onDateChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const [month, setMonth] = React.useState<Date | undefined>(
    date ? date.toDate() : undefined
  );
  const [value, setValue] = React.useState(
    formatDate(date ? date.toDate() : undefined)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = dayjs(e.target.value);
    setValue(e.target.value);
    if (date.isValid()) {
      onDateChange(date);
      setMonth(date.toDate());
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date ? dayjs(date) : null);
    setValue(formatDate(date));
    setOpen(false);
  };

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={value}
        placeholder="June 01, 2025"
        className="bg-background pr-10"
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Elegir fecha</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date?.toDate()}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
