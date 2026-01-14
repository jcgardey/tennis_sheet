import { SLOT_HEIGHT } from '@/consts/booking';
import { PlusCircle } from 'lucide-react';

interface FreeSlotsProps {
  size: number;
}

export const FreeSlots: React.FC<FreeSlotsProps> = ({ size }) => (
  <div
    className="p-1 border-border"
    style={{ height: `${SLOT_HEIGHT * size}px` }}
  >
    <button className="w-full h-full group flex flex-col items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-150 cursor-pointer">
      <PlusCircle className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary/60 transition-colors" />
    </button>
  </div>
);
