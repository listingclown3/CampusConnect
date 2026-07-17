'use client';

import { useEffect, useMemo, useState, useCallback, useSyncExternalStore } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import {
  getStudentById,
  getStudentClassIds,
  getClassesByIds,
} from '@/lib/mock-data';
import { calculateMatchScore } from '@/lib/matching/score';
import { getAvailabilityOverlap } from '@/lib/matching/availability';
import { generateMatchExplanation, generateConversationStarter } from '@/lib/ai';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CompatibilityBreakdown } from '@/components/matches/compatibility-breakdown';
import { SharedAvailability } from '@/components/matches/shared-availability';
import { ConversationStarter } from '@/components/matches/conversation-starter';
import { getInitials, cn } from '@/lib/utils';
import {
  ArrowLeft,
  MessageCircle,
  Bookmark,
  GraduationCap,
  Target,
  Sparkles,
  UserX,
} from 'lucide-react';
import { saveMatch, unsaveMatch, isMatchSaved } from '@/lib/data/match-actions';
import { subscribeToStorage } from '@/lib/storage-sync';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const matchId = params.id as string;

  const [explanation, setExplanation] = useState<string>('');
  const [starterMessage, setStarterMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  const matchedStudent = useMemo(() => {
    return getStudentById(matchId) || null;
  }, [matchId]);

  // Saved state, kept in sync with storage
  const getSavedSnapshot = useCallback(
    () => (matchedStudent ? isMatchSaved(matchedStudent.user_id) : false),
    [matchedStudent]
  );
  const saved = useSyncExternalStore(subscribeToStorage, getSavedSnapshot, getSavedSnapshot);

  const matchResult = useMemo(() => {
    if (!user || !matchedStudent) return null;
    const currentUserClasses = getStudentClassIds(user.user_id);
    const studentClasses = getStudentClassIds(matchedStudent.user_id);
    return calculateMatchScore(user, matchedStudent, currentUserClasses, studentClasses);
  }, [user, matchedStudent]);

  const sharedClasses = useMemo(() => {
    if (!user || !matchedStudent) return [];
    const currentUserClasses = getStudentClassIds(user.user_id);
    const studentClasses = getStudentClassIds(matchedStudent.user_id);
    const sharedIds = currentUserClasses.filter((id) => studentClasses.includes(id));
    return getClassesByIds(sharedIds);
  }, [user, matchedStudent]);

  const sharedInterests = useMemo(() => {
    if (!user || !matchedStudent) return [];
    return user.interests.filter((i) =>
      matchedStudent.interests.some((si) => si.toLowerCase() === i.toLowerCase())
    );
  }, [user, matchedStudent]);

  const overlapCount = useMemo(() => {
    if (!user || !matchedStudent) return 0;
    return getAvailabilityOverlap(user.availability, matchedStudent.availability).length;
  }, [user, matchedStudent]);

  // Generate AI explanations
  useEffect(() => {
    if (!user || !matchedStudent || !matchResult) return;

    const sharedClassNames = sharedClasses.map((c) => c.course_code);
    const currentUser = user;
    const currentMatch = matchedStudent;
    const currentResult = matchResult;

    async function generate() {
      setIsGenerating(true);
      try {
        const [exp, starter] = await Promise.all([
          generateMatchExplanation(currentUser, currentMatch, currentResult.breakdown, sharedClassNames),
          generateConversationStarter(currentUser, currentMatch, sharedClassNames),
        ]);
        setExplanation(exp);
        setStarterMessage(starter);
      } catch {
        setExplanation(`${currentMatch.first_name} could be a great connection based on your profiles.`);
        setStarterMessage(`Hey ${currentMatch.first_name}! I'd love to connect and learn more about your experience at SJSU.`);
      }
      setIsGenerating(false);
    }

    generate();
  }, [user, matchedStudent, matchResult, sharedClasses]);

  const handleToggleSave = () => {
    if (!matchedStudent) return;
    if (saved) {
      unsaveMatch(matchedStudent.user_id);
    } else {
      saveMatch(matchedStudent.user_id);
    }
  };

  const handleStartChat = () => {
    if (!matchedStudent) return;
    router.push(`/chat?user=${matchedStudent.user_id}`);
  };

  if (authLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // 404 state
  if (!matchedStudent) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <UserX className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Student not found</h2>
            <p className="text-sm text-muted-foreground">
              This student profile doesn&apos;t exist or has been hidden.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/matches')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  const score = matchResult?.score ?? 0;

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 pb-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {getInitials(`${matchedStudent.first_name} ${matchedStudent.last_name}`)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">
            {matchedStudent.first_name} {matchedStudent.last_name}
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            {matchedStudent.major} &middot; Class of {matchedStudent.graduation_year} &middot; {matchedStudent.student_type}
          </p>
          {matchedStudent.bio && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {matchedStudent.bio}
            </p>
          )}
        </div>
      </div>

      {/* Compatibility score circle */}
      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 264} 264`}
                className={cn(
                  score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-orange-400'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{score}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Overall Compatibility
          </p>
        </CardContent>
      </Card>

      {/* Full breakdown */}
      {matchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compatibility Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CompatibilityBreakdown breakdown={matchResult.breakdown} />
          </CardContent>
        </Card>
      )}

      {/* Why this match works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why This Match Works</CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
          )}
        </CardContent>
      </Card>

      {/* Shared classes */}
      {sharedClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Shared Classes ({sharedClasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sharedClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <Badge variant="secondary" className="shrink-0 font-mono text-xs">
                    {cls.course_code}
                  </Badge>
                  <span className="text-sm">{cls.course_name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlapping availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Schedule Overlap ({overlapCount} shared slot{overlapCount !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user && (
            <SharedAvailability
              availabilityA={user.availability}
              availabilityB={matchedStudent.availability}
            />
          )}
        </CardContent>
      </Card>

      {/* Common interests */}
      {sharedInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Common Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sharedInterests.map((interest) => (
                <Badge key={interest} variant="secondary" className="capitalize">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career goals comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            Career Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Your goals
              </p>
              <div className="space-y-1">
                {user?.career_goals.map((goal) => (
                  <p key={goal} className="text-sm capitalize">{goal}</p>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {matchedStudent.first_name}&apos;s goals
              </p>
              <div className="space-y-1">
                {matchedStudent.career_goals.map((goal) => (
                  <p key={goal} className="text-sm capitalize">{goal}</p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complementary skills */}
      {(() => {
        if (!user) return null;
        const myUniqueSkills = user.skills.filter(
          (s) => !matchedStudent.skills.some((ms) => ms.toLowerCase() === s.toLowerCase())
        );
        const theirUniqueSkills = matchedStudent.skills.filter(
          (s) => !user.skills.some((ms) => ms.toLowerCase() === s.toLowerCase())
        );
        if (myUniqueSkills.length === 0 && theirUniqueSkills.length === 0) return null;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Complementary Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    You bring
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {myUniqueSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {matchedStudent.first_name} brings
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {theirUniqueSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Conversation starter */}
      {!isGenerating && starterMessage && (
        <ConversationStarter
          message={starterMessage}
          targetUserId={matchedStudent.user_id}
        />
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-background/95 backdrop-blur py-3 px-4 -mx-4 border-t">
        <Button
          variant="default"
          className="flex-1"
          onClick={handleStartChat}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Start Chat
        </Button>
        <Button
          variant={saved ? 'secondary' : 'outline'}
          size="icon"
          onClick={handleToggleSave}
          title={saved ? 'Unsave' : 'Save match'}
        >
          <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
        </Button>
      </div>
    </div>
  );
}
