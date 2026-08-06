import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsLoading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
