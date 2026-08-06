'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function EventsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorState
        variant="generic"
        title="Failed to load events"
        description="Something went wrong loading events. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
