'use client';

import { useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import { getStudents, getStudentClassIds, getClassesByIds } from '@/lib/mock-data';
import { calculateMatchScore } from '@/lib/matching/score';
import { getSkippedMatches, undoSkipMatch } from '@/lib/data/match-actions';
import { getHiddenUserIds } from '@/lib/data/safety-actions';
import { MatchCard } from '@/components/matches/match-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Undo2 } from 'lucide-react';

export default function MatchesPage() {
  const { user, isLoading } = useAuth();
  const [skippedList, setSkippedList] = useState<string[]>(() => getSkippedMatches());
  const [lastSkipped, setLastSkipped] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!user) return [];
    const hiddenIds = getHiddenUserIds(user.user_id);
    const students = getStudents().filter(
      (s) => s.user_id !== user.user_id && s.is_visible && !hiddenIds.includes(s.user_id)
    );
    const currentUserClasses = getStudentClassIds(user.user_id);

    const scored = students.map((student) => {
      const studentClasses = getStudentClassIds(student.user_id);
      const result = calculateMatchScore(user, student, currentUserClasses, studentClasses);

      // Get shared classes info
      const sharedClassIds = currentUserClasses.filter((id) => studentClasses.includes(id));
      const sharedClasses = getClassesByIds(sharedClassIds);

      // Get shared interests
      const sharedInterests = user.interests.filter((i) =>
        student.interests.some((si) => si.toLowerCase() === i.toLowerCase())
      );

      return {
        student,
        score: result.score,
        reasons: result.reasons,
        sharedClassesCount: sharedClasses.length,
        sharedInterestsCount: sharedInterests.length,
      };
    });

    // Sort by score descending, filter out zero-score matches
    scored.sort((a, b) => b.score - a.score);
    return scored.filter((m) => m.score > 0);
  }, [user]);

  // Filter out skipped users
  const visibleMatches = useMemo(() => {
    return matches.filter((m) => !skippedList.includes(m.student.user_id));
  }, [matches, skippedList]);

  const handleSkip = useCallback((userId: string) => {
    setSkippedList((prev) => [...prev, userId]);
    setLastSkipped(userId);
  }, []);

  const handleUndo = useCallback(() => {
    if (lastSkipped) {
      undoSkipMatch(lastSkipped);
      setSkippedList((prev) => prev.filter((id) => id !== lastSkipped));
      setLastSkipped(null);
    }
  }, [lastSkipped]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Matches</h1>
          <p className="text-sm text-muted-foreground">
            {visibleMatches.length} student{visibleMatches.length !== 1 ? 's' : ''} matched with you
          </p>
        </div>
        {lastSkipped && (
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo2 className="w-3.5 h-3.5 mr-1.5" />
            Undo skip
          </Button>
        )}
      </div>

      {visibleMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">No matches yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Complete your profile with classes, interests, and availability to get better matches.
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => window.location.href = '/settings/profile'}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Complete Profile
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleMatches.map(({ student, score, reasons, sharedClassesCount, sharedInterestsCount }) => (
            <MatchCard
              key={student.user_id}
              userId={student.user_id}
              name={`${student.first_name} ${student.last_name}`}
              major={student.major}
              year={student.graduation_year}
              studentType={student.student_type}
              compatibility={score}
              reasons={reasons}
              sharedClassesCount={sharedClassesCount}
              sharedInterestsCount={sharedInterestsCount}
              onSkip={() => handleSkip(student.user_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
