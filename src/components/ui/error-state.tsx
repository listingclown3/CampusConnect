'use client';

import { AlertCircle, ShieldX, Search, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorVariant = 'generic' | 'not-found' | 'access-denied' | 'network';

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

const ERROR_CONFIGS: Record<ErrorVariant, { icon: typeof AlertCircle; title: string; description: string }> = {
  generic: {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
  },
  'not-found': {
    icon: Search,
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
  },
  'access-denied': {
    icon: ShieldX,
    title: 'Access denied',
    description: 'You do not have permission to view this content.',
  },
  network: {
    icon: WifiOff,
    title: 'Connection error',
    description: 'Unable to connect to the server. Check your internet connection and try again.',
  },
};

export function ErrorState({
  variant = 'generic',
  title,
  description,
  onRetry,
  onBack,
  className,
}: ErrorStateProps) {
  const config = ERROR_CONFIGS[variant];
  const Icon = config.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {description || config.description}
      </p>
      <div className="flex gap-2 mt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="min-h-[44px]">
            Go Back
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry} className="min-h-[44px]">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
