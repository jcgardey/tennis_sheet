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
import { useLocale, useTranslations } from 'next-intl';
import { enUS, es } from 'date-fns/locale';
import { format, isValid, parse } from 'date-fns';

const getDateFnsLocale = (locale: string) => (locale === 'es' ? es : enUS);

function formatDate(date: Date | undefined, locale: string) {
  if (!date) {
    return '';
  }

  return format(date, 'PPP', { locale: getDateFnsLocale(locale) });
}

interface DatepickerProps {
  date: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}

export const Datepicker: React.FC<DatepickerProps> = ({
  date,
  onDateChange,
}) => {
  const locale = useLocale();
  const t = useTranslations('Booking');
  const [open, setOpen] = React.useState(false);

  const [month, setMonth] = React.useState<Date | undefined>(
    date ? date.toDate() : undefined
  );
  const [value, setValue] = React.useState(
    formatDate(date ? date.toDate() : undefined, locale)
  );

  React.useEffect(() => {
    setValue(formatDate(date?.toDate(), locale));
  }, [date, locale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedDate = parse(e.target.value, 'PPP', new Date(), {
      locale: getDateFnsLocale(locale),
    });
    setValue(e.target.value);
    if (isValid(parsedDate)) {
      const nextDate = dayjs(parsedDate);
      onDateChange(nextDate);
      setMonth(parsedDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date ? dayjs(date) : null);
    setValue(formatDate(date, locale));
    setOpen(false);
  };

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={value}
        placeholder={t('datePlaceholder')}
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
            <span className="sr-only">{t('chooseDate')}</span>
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
            locale={locale === 'es' ? es : enUS}
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
