'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function MatchesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorState
        variant="generic"
        title="Failed to load matches"
        description="Something went wrong loading your matches. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
