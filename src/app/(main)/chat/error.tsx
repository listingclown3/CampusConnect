'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function ChatError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorState
        variant="generic"
        title="Failed to load conversations"
        description="Something went wrong loading your messages. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
