import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function PodsLoading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
