'use client';

import { BookOpen, Clock, Briefcase, Lightbulb, GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchReasonBadgeProps {
  reason: string;
  className?: string;
}

function getReasonIcon(reason: string) {
  const lowerReason = reason.toLowerCase();
  if (lowerReason.includes('class') || lowerReason.includes('cs ') || lowerReason.includes('math') || lowerReason.includes('enrolled')) {
    return BookOpen;
  }
  if (lowerReason.includes('schedule') || lowerReason.includes('time') || lowerReason.includes('available')) {
    return Clock;
  }
  if (lowerReason.includes('career') || lowerReason.includes('goal')) {
    return Briefcase;
  }
  if (lowerReason.includes('interest')) {
    return Lightbulb;
  }
  if (lowerReason.includes('major')) {
    return GraduationCap;
  }
  if (lowerReason.includes('skill') || lowerReason.includes('complementary')) {
    return Sparkles;
  }
  return Lightbulb;
}

export function MatchReasonBadge({ reason, className }: MatchReasonBadgeProps) {
  const Icon = getReasonIcon(reason);

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
