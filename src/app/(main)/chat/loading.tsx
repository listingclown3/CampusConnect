import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatLoading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-7 w-28" />
      <LoadingSkeleton variant="list" count={6} />
    </div>
  );
}
