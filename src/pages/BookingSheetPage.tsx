import TimeColumn from '@/components/booking/TimeColumn';
import { useQuery } from '@tanstack/react-query';

import { CourtGrid } from '@/components/booking/CourtGrid';
import { getAllCourts, type CreateReservationData } from '@/services/courts';
import { Card } from '@/components/ui/card';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Datepicker } from '@/components/booking/DatePicker';
import { CreateReservationModal } from '@/components/booking/CreateReservationModal';
import { useCreateReservation } from '@/hooks/useCreateReservation';
import { Button } from '@/components/ui/button';
import { TSAlert } from '@/components/design-system/TSAlert';
import { Spinner } from '@/components/ui/spinner';
import type { ReservationFormData } from '@/components/booking/ReservationForm';

export default function BookingSheet() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [matchInitialData, setMatchInitialData] = useState<
    Partial<ReservationFormData>
  >({});

  const {
    data: courts,
    isLoading,
    error,
  } = useQuery({ queryKey: ['courts'], queryFn: getAllCourts });

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

  const handleFreeSlotClick = (startTime: string, courtId: number) => {
    setMatchInitialData({ startTime, courtId });
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return <TSAlert status="error" message="Error while loading courts" />;
  }

  if (courts?.length === 0) {
    return <TSAlert status="warning" message="No courts available" />;
  }
  return (
    <div className="min-h-screen font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header de la App */}
        <div className="flex flex-col gap-4 border-b border-border pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Reservas</h1>
          <div className="flex gap-8">
            <div className="w-1/5">
              <Datepicker date={selectedDate} onDateChange={handleDateChange} />
            </div>
            <CreateReservationModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreateReservation={handleCreateReservation}
              isLoading={isCreatingReservation}
              initialData={matchInitialData}
            />
            <Button onClick={handleShowReservationModal}>Crear Reserva</Button>
          </div>
        </div>

        <Card className="py-0">
          <div className="flex overflow-x-auto">
            <TimeColumn />
            {(courts ?? []).map((court) => (
              <CourtGrid
                key={court.id}
                court={court}
                date={selectedDate}
                onFreeSlotClick={handleFreeSlotClick}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
