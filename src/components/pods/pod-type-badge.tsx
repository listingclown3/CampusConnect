'use client';

import { Badge } from '@/components/ui/badge';
import type { PodType } from '@/types/database';
import { cn } from '@/lib/utils';

const podTypeColors: Record<PodType, string> = {
  study: 'bg-blue-100 text-blue-700 border-blue-200',
  project: 'bg-purple-100 text-purple-700 border-purple-200',
  career: 'bg-green-100 text-green-700 border-green-200',
  interest: 'bg-orange-100 text-orange-700 border-orange-200',
  event: 'bg-teal-100 text-teal-700 border-teal-200',
  major_switch: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const podTypeLabels: Record<PodType, string> = {
  study: 'Study',
  project: 'Project',
  career: 'Career',
  interest: 'Interest',
  event: 'Event',
  major_switch: 'Major Switch',
};

interface PodTypeBadgeProps {
  type: PodType;
  className?: string;
}

export function PodTypeBadge({ type, className }: PodTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] font-medium border px-1.5 py-0.5',
        podTypeColors[type],
        className
      )}
    >
      {podTypeLabels[type]}
    </Badge>
  );
}
