'use client';

import { format, isToday, isYesterday } from 'date-fns';

interface DateSeparatorProps {
  date: string;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground font-medium px-2">
        {formatDateLabel(date)}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
