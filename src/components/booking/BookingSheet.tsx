'use client';

import TimeColumn from '@/components/booking/TimeColumn';
import CourtGrid from '@/components/booking/CourtGrid';
import type { Court, CreateReservationData } from '@/services/courts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  addDays,
  addHours,
  format,
  setHours,
  setMinutes,
  subDays,
} from 'date-fns';
import { useState } from 'react';
import DatePicker from '@/components/booking/DatePicker';
import { CreateReservationModal } from '@/components/booking/CreateReservationModal';
import { useCreateReservation } from '@/hooks/useCreateReservation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { ReservationInputData } from '@/schemas/reservationSchemas';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingSheetClientProps {
  courts: Court[];
}

export default function BookingSheet({ courts }: BookingSheetClientProps) {
  const t = useTranslations('Booking');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [matchInitialData, setMatchInitialData] = useState<
    Partial<ReservationInputData>
  >({});

  const [selectedCourtId, setSelectedCourtId] = useState<string>();
  const activeCourtId = selectedCourtId ?? String(courts[0]?.id);

  const { isPending: isCreatingReservation, mutateAsync: createReservation } =
    useCreateReservation();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCreateReservation = async (data: CreateReservationData) => {
    await createReservation(data);
  };

  const handleShowReservationModal = () => {
    setMatchInitialData({ date: selectedDate });
    setIsCreateModalOpen(true);
  };

  const handleFreeSlotClick = (startTime: string, court: Court) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const endTime = format(
      addHours(setMinutes(setHours(selectedDate, hour), minute), 1),
      'HH:mm',
    );
    setMatchInitialData({ startTime, endTime, court });
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <DatePicker date={selectedDate} onDateChange={handleDateChange} />
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            {t('today')}
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <CreateReservationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateReservation={handleCreateReservation}
          isLoading={isCreatingReservation}
          initialData={matchInitialData}
        />
        <Button onClick={handleShowReservationModal}>
          {t('createReservation')}
          {isCreatingReservation && <Spinner className="ml-2 size-4" />}
        </Button>
      </div>

      <Tabs
        value={activeCourtId}
        onValueChange={setSelectedCourtId}
        className="md:hidden pb-4"
      >
        <TabsList className="w-full overflow-x-auto justify-start">
          {courts.map((court) => (
            <TabsTrigger key={court.id} value={String(court.id)}>
              {court.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="py-0">
        <div className="flex overflow-x-auto">
          <TimeColumn />
          {courts.map((court) => (
            <CourtGrid
              key={court.id}
              court={court}
              date={selectedDate}
              onFreeSlotClick={handleFreeSlotClick}
              className={cn({
                'hidden md:block': String(court.id) !== activeCourtId,
              })}
            />
          ))}
        </div>
      </Card>
    </>
  );
}
