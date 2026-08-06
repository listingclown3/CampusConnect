'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendationReasonProps {
  reason: string;
  className?: string;
}

export function RecommendationReason({ reason, className }: RecommendationReasonProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-full px-2.5 py-1 border border-amber-200 dark:border-amber-800',
        className
      )}
    >
      <Sparkles className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{reason}</span>
    </div>
  );
}
