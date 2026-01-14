import TimeColumn from '@/components/booking/TimeColumn';
import { useQuery } from '@tanstack/react-query';

import { CourtGrid } from '@/components/booking/CourtGrid';
import { getAllCourts, type CreateMatchData } from '@/services/courts';
import { Card } from '@/components/ui/card';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Datepicker } from '@/components/booking/DatePicker';
import { CreateMatchModal } from '@/components/booking/CreateMatchModal';
import { useCreateMatch } from '@/hooks/useCreateMatch';
import { Button } from '@/components/ui/button';
import { TSAlert } from '@/components/design-system/TSAlert';
import { Spinner } from '@/components/ui/spinner';

export default function BookingSheet() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: courts,
    isLoading,
    error,
  } = useQuery({ queryKey: ['courts'], queryFn: getAllCourts });

  const { isPending: isCreatingMatch, mutateAsync: createMatch } =
    useCreateMatch();

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCreateMatch = async (data: CreateMatchData) => {
    await createMatch(data);
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
            <CreateMatchModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreateMatch={handleCreateMatch}
              isLoading={isCreatingMatch}
            />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Crear Reserva
            </Button>
          </div>
        </div>

        <Card className="py-0">
          <div className="flex overflow-x-auto">
            <TimeColumn />
            {(courts ?? []).map((court) => (
              <CourtGrid key={court.id} court={court} date={selectedDate} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
