'use client';

import { BookOpen, GraduationCap, Clock, Lightbulb, Briefcase, Sparkles } from 'lucide-react';
import type { MatchBreakdown } from '@/types/database';
import { cn } from '@/lib/utils';

interface CompatibilityBreakdownProps {
  breakdown: MatchBreakdown;
}

const CATEGORIES = [
  { key: 'shared_classes' as const, label: 'Shared Classes', max: 30, icon: BookOpen },
  { key: 'same_or_related_major' as const, label: 'Major Similarity', max: 20, icon: GraduationCap },
  { key: 'availability_overlap' as const, label: 'Schedule Overlap', max: 15, icon: Clock },
  { key: 'shared_interests' as const, label: 'Shared Interests', max: 15, icon: Lightbulb },
  { key: 'career_goal_similarity' as const, label: 'Career Goals', max: 10, icon: Briefcase },
  { key: 'complementary_skills' as const, label: 'Complementary Skills', max: 10, icon: Sparkles },
];

export function CompatibilityBreakdown({ breakdown }: CompatibilityBreakdownProps) {
  return (
    <div className="space-y-3">
      {CATEGORIES.map(({ key, label, max, icon: Icon }) => {
        const earned = breakdown[key];
        const percentage = Math.round((earned / max) * 100);

        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{label}</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {earned}/{max} pts
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-orange-400'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
