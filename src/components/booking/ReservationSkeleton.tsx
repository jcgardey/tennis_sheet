import { TIME_SLOTS } from '@/consts/booking';
import { Skeleton } from '../ui/skeleton';

export const ReservationSkeleton: React.FC = () => {
  return (
    <>
      {TIME_SLOTS.map((item) => {
        if (item.endsWith(':00')) {
          return (
            <div key={item} className="p-4 h-24">
              <Skeleton key={item} className="rounded-md h-full" />
            </div>
          );
        }
        return null;
      })}
    </>
  );
};
