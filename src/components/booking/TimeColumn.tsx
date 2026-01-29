import { SLOT_HEIGHT, TIME_SLOTS } from '@/consts/booking';
import { Clock } from 'lucide-react';
import { Text } from '../design-system/Text';

export default function TimeColumn() {
  return (
    <div className="flex-none w-24 border-r border-border bg-muted/5 sticky left-0 z-20">
      <div className="h-20 bg-muted/50 border-b border-border flex items-center justify-center text-muted-foreground">
        <Clock className="w-4 h-4" />
      </div>
      {TIME_SLOTS.map((time, i) => {
        if (time.endsWith(':00')) {
          return (
            <div
              key={time}
              className="flex items-center justify-center border-b border-border"
              style={{ height: `${SLOT_HEIGHT * 2}px` }}
            >
              <Text variant="large">{time.split(':')[0]}hs</Text>
            </div>
          );
        }
        if (i === TIME_SLOTS.length - 1) {
          return (
            <div
              key={time}
              className="flex items-center justify-center border-b border-border text-sm font-bold text-muted-foreground"
              style={{ height: `${SLOT_HEIGHT}px` }}
            >
              {time}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
