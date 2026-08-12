'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function PodsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorState
        variant="generic"
        title="Failed to load pods"
        description="Something went wrong loading your study pods. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
