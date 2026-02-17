import { SLOT_HEIGHT } from '@/consts/booking';

interface TimeSlotProps {
  onClick?: () => void;
  className?: string;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ onClick, className }) => (
  <div
    className={`px-1 cursor-pointer ${className ?? ''}`}
    style={{ height: `${SLOT_HEIGHT}px` }}
    onClick={onClick}
  ></div>
);
