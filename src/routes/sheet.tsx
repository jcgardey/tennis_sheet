import BookingSheet from '@/pages/BookingSheetPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sheet')({
  component: BookingSheet,
});
