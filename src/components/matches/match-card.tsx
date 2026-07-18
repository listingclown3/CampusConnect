'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getInitials, cn } from '@/lib/utils';
import { MatchReasonBadge } from './match-reason-badge';
import { MatchActions } from './match-actions';
import { SocialLinksDisplay } from '@/components/social-links/social-links-display';
import { BookOpen, Lightbulb, GraduationCap, Sparkles, MessageCircle } from 'lucide-react';

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
  bio?: string | null;
  interests?: string[];
  skills?: string[];
  studyStyle?: string;
  onSkip?: () => void;
}

function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-amber-500 to-yellow-500';
  return 'from-orange-500 to-red-400';
}

function getCompatibilityBg(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900';
  if (score >= 60) return 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900';
  return 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900';
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
  bio,
  interests,
  skills,
  studyStyle,
  onSkip,
}: MatchCardProps) {
  return (
    <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 group overflow-hidden h-full flex flex-col">
      {/* Compatibility gradient bar at top */}
      <div className={cn('h-1.5 w-full bg-gradient-to-r', getCompatibilityColor(compatibility))} />
      
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header row with avatar and score */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-background shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{name}</h3>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="w-3 h-3 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                {major}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
              Class of {year} &middot; {studentType}
            </p>
          </div>
          <div className={cn('px-2.5 py-1.5 rounded-lg border text-center shrink-0', getCompatibilityBg(compatibility))}>
            <div className="text-lg font-bold leading-none">{compatibility}%</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">match</div>
          </div>
        </div>

        {/* Bio preview */}
        {bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic border-l-2 border-primary/20 pl-2.5">
            {bio}
          </p>
        )}

        {/* Interests/skills pills */}
        {(interests && interests.length > 0) || (skills && skills.length > 0) ? (
          <div className="flex flex-wrap gap-1">
            {interests?.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="secondary" className="text-[10px] font-normal px-2 py-0.5">
                {interest}
              </Badge>
            ))}
            {skills?.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="outline" className="text-[10px] font-normal px-2 py-0.5 border-primary/30 text-primary">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Study style indicator */}
        {studyStyle && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span className="capitalize">Prefers {studyStyle} study</span>
          </div>
        )}

        {/* Reasons badges */}
        {reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {reasons.slice(0, 2).map((reason, i) => (
              <MatchReasonBadge key={i} reason={reason} />
            ))}
          </div>
        )}

        {/* Social links */}
        <SocialLinksDisplay userId={userId} compact className="mt-1" />

        {/* Stats + actions - pushed to bottom */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {sharedClassesCount > 0 && (
              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
                <BookOpen className="w-3 h-3 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-400 font-medium">{sharedClassesCount}</span>
              </span>
            )}
            {sharedInterestsCount > 0 && (
              <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">
                <Lightbulb className="w-3 h-3 text-purple-600" />
                <span className="text-purple-700 dark:text-purple-400 font-medium">{sharedInterestsCount}</span>
              </span>
            )}
          </div>
          <MatchActions userId={userId} onSkip={onSkip} />
        </div>
      </CardContent>
    </Card>
  );
}
