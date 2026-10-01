'use client';

import TimeColumn from '@/components/booking/TimeColumn';
import { CourtGrid } from '@/components/booking/CourtGrid';
import type { Court, CreateReservationData } from '@/services/courts';
import { Card } from '@/components/ui/card';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { Datepicker } from '@/components/booking/DatePicker';
import { CreateReservationModal } from '@/components/booking/CreateReservationModal';
import { useCreateReservation } from '@/hooks/useCreateReservation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { ReservationInputData } from '@/schemas/reservationSchemas';

interface BookingSheetClientProps {
  courts: Court[];
}

export default function BookingSheet({ courts }: BookingSheetClientProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [matchInitialData, setMatchInitialData] = useState<
    Partial<ReservationInputData>
  >({});

  const { isPending: isCreatingReservation, mutateAsync: createReservation } =
    useCreateReservation();

  const handleDateChange = (date: Dayjs | null) => {
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
    const endTime = selectedDate
      .set('hour', hour)
      .set('minute', minute)
      .add(1, 'hour')
      .format('HH:mm');
    setMatchInitialData({ startTime, endTime, court });
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 py-4">
        <div className="w-full sm:w-1/5">
          <Datepicker date={selectedDate} onDateChange={handleDateChange} />
        </div>
        <CreateReservationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateReservation={handleCreateReservation}
          isLoading={isCreatingReservation}
          initialData={matchInitialData}
        />
        <Button onClick={handleShowReservationModal}>
          Crear Reserva
          {isCreatingReservation && <Spinner className="ml-2 size-4" />}
        </Button>
      </div>

      <Card className="py-0">
        <div className="flex overflow-x-auto">
          <TimeColumn />
          {courts.map((court) => (
            <CourtGrid
              key={court.id}
              court={court}
              date={selectedDate}
              onFreeSlotClick={handleFreeSlotClick}
            />
          ))}
        </div>
      </Card>
    </>
  );
}
