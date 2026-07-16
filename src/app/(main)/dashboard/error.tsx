'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorState
        variant="generic"
        title="Failed to load dashboard"
        description="Something went wrong loading your dashboard. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
