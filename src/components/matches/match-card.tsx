'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials, cn } from '@/lib/utils';
import { MatchReasonBadge } from './match-reason-badge';
import { MatchActions } from './match-actions';
import { BookOpen, Lightbulb } from 'lucide-react';

interface MatchCardProps {
  userId: string;
  name: string;
  major: string;
  year: number;
  studentType: string;
  compatibility: number;
  reasons: string[];
  sharedClassesCount: number;
  sharedInterestsCount: number;
  onSkip?: () => void;
}

function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
}

export function MatchCard({
  userId,
  name,
  major,
  year,
  studentType,
  compatibility,
  reasons,
  sharedClassesCount,
  sharedInterestsCount,
  onSkip,
}: MatchCardProps) {
  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{name}</h3>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0',
                  getCompatibilityColor(compatibility)
                )}
              >
                {compatibility}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {major} &middot; Class of {year} &middot; {studentType}
            </p>
          </div>
        </div>

        {/* Reasons badges */}
        {reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {reasons.slice(0, 3).map((reason, i) => (
              <MatchReasonBadge key={i} reason={reason} />
            ))}
          </div>
        )}

        {/* Stats + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {sharedClassesCount > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {sharedClassesCount} class{sharedClassesCount > 1 ? 'es' : ''}
              </span>
            )}
            {sharedInterestsCount > 0 && (
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                {sharedInterestsCount} interest{sharedInterestsCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <MatchActions userId={userId} onSkip={onSkip} />
        </div>
      </CardContent>
    </Card>
  );
}
