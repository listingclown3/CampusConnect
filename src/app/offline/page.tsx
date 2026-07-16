'use client';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm mx-auto">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0055A2]/10">
          <WifiOff className="h-10 w-10 text-[#0055A2]" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          You appear to be offline
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          SpartanCircle needs an internet connection to sync your matches and messages.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your data will be here when you reconnect.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0055A2] px-6 py-3 text-sm font-medium text-white hover:bg-[#003d75] transition-colors min-h-[44px] min-w-[44px]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
