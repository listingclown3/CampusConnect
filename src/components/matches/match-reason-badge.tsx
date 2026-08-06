'use client';

import { BookOpen, Clock, Briefcase, Lightbulb, GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchReasonBadgeProps {
  reason: string;
  className?: string;
}

export function MatchReasonBadge({ reason, className }: MatchReasonBadgeProps) {
  const lowerReason = reason.toLowerCase();

  let Icon = Lightbulb;
  if (lowerReason.includes('class') || lowerReason.includes('cs ') || lowerReason.includes('math') || lowerReason.includes('enrolled')) {
    Icon = BookOpen;
  } else if (lowerReason.includes('schedule') || lowerReason.includes('time') || lowerReason.includes('available')) {
    Icon = Clock;
  } else if (lowerReason.includes('career') || lowerReason.includes('goal')) {
    Icon = Briefcase;
  } else if (lowerReason.includes('interest')) {
    Icon = Lightbulb;
  } else if (lowerReason.includes('major')) {
    Icon = GraduationCap;
  } else if (lowerReason.includes('skill') || lowerReason.includes('complementary')) {
    Icon = Sparkles;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/8 text-primary border border-primary/15',
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span className="truncate max-w-[140px]">{reason}</span>
    </span>
  );
}
