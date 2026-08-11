'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { getVisibleProfiles, getUserClassIds, getUserClassIdsForUsers } from '@/lib/data/client';
import { calculateMatchScore } from '@/lib/matching/score';
import type { Profile } from '@/types/database';
import { getSkippedMatches, undoSkipMatch } from '@/lib/data/match-actions';
import { getHiddenUserIds } from '@/lib/data/safety-actions';
import { MatchCard } from '@/components/matches/match-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Undo2, Search, SlidersHorizontal, Sparkles, GraduationCap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'high_match' | 'same_major' | 'shared_classes' | 'study_buddies' | 'project_partners';
type SortType = 'compatibility' | 'shared_classes' | 'shared_interests';

const FILTER_OPTIONS: { label: string; value: FilterType; icon?: React.ReactNode }[] = [
  { label: 'All', value: 'all' },
  { label: 'High Match (80%+)', value: 'high_match', icon: <Sparkles className="w-3 h-3" /> },
  { label: 'Same Major', value: 'same_major', icon: <GraduationCap className="w-3 h-3" /> },
  { label: 'Shared Classes', value: 'shared_classes' },
  { label: 'Study Buddies', value: 'study_buddies' },
  { label: 'Project Partners', value: 'project_partners' },
];

const MAJOR_FILTERS = [
  'Computer Science', 'Software Engineering', 'Computer Engineering', 'Data Science',
  'Business Administration', 'Biology', 'Psychology', 'Mechanical Engineering',
  'Electrical Engineering', 'Communications', 'Graphic Design', 'English',
  'Environmental Science', 'Kinesiology', 'Marketing', 'Biomedical Engineering',
];

interface ScoredMatch {
  student: Profile;
  score: number;
  reasons: string[];
  sharedClassesCount: number;
  sharedInterestsCount: number;
  sharedInterests: string[];
}

export default function MatchesPage() {
  const { user, isLoading } = useAuth();
  const [skippedList, setSkippedList] = useState<string[]>([]);
  const [lastSkipped, setLastSkipped] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('compatibility');
  const [majorFilter, setMajorFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [matches, setMatches] = useState<ScoredMatch[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setMatchesLoading(true);
      const [hiddenIds, visibleProfiles, currentUserClasses, skipped] = await Promise.all([
        getHiddenUserIds(user.user_id),
        getVisibleProfiles(user.user_id),
        getUserClassIds(user.user_id),
        getSkippedMatches(),
      ]);
      if (cancelled) return;
      setSkippedList(skipped);
      const students = visibleProfiles.filter((s) => !hiddenIds.includes(s.user_id));
      const classIdsByUser = await getUserClassIdsForUsers(students.map((s) => s.user_id));
      if (cancelled) return;

      const scored: ScoredMatch[] = students.map((student) => {
        const studentClasses = classIdsByUser[student.user_id] ?? [];
        const result = calculateMatchScore(user, student, currentUserClasses, studentClasses);
        const sharedClassIds = currentUserClasses.filter((id) => studentClasses.includes(id));
        const sharedInterests = user.interests.filter((i) =>
          student.interests.some((si) => si.toLowerCase() === i.toLowerCase())
        );

        return {
          student,
          score: result.score,
          reasons: result.reasons,
          sharedClassesCount: sharedClassIds.length,
          sharedInterestsCount: sharedInterests.length,
          sharedInterests,
        };
      });

      scored.sort((a, b) => b.score - a.score);
      setMatches(scored.filter((m) => m.score > 0));
      setMatchesLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Apply all filters
  const filteredMatches = useMemo(() => {
    let results = matches.filter((m) => !skippedList.includes(m.student.user_id));

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (m) =>
          m.student.first_name.toLowerCase().includes(q) ||
          m.student.last_name.toLowerCase().includes(q) ||
          m.student.major.toLowerCase().includes(q) ||
          m.student.interests.some((i) => i.toLowerCase().includes(q)) ||
          m.student.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Major filter
    if (majorFilter) {
      results = results.filter((m) => m.student.major === majorFilter);
    }

    // Category filter
    switch (filter) {
      case 'high_match':
        results = results.filter((m) => m.score >= 80);
        break;
      case 'same_major':
        results = results.filter((m) => user && m.student.major === user.major);
        break;
      case 'shared_classes':
        results = results.filter((m) => m.sharedClassesCount > 0);
        break;
      case 'study_buddies':
        results = results.filter((m) => m.student.connection_types.includes('study_buddies'));
        break;
      case 'project_partners':
        results = results.filter((m) => m.student.connection_types.includes('project_partners'));
        break;
    }

    // Sort
    switch (sortBy) {
      case 'shared_classes':
        results.sort((a, b) => b.sharedClassesCount - a.sharedClassesCount || b.score - a.score);
        break;
      case 'shared_interests':
        results.sort((a, b) => b.sharedInterestsCount - a.sharedInterestsCount || b.score - a.score);
        break;
      default:
        results.sort((a, b) => b.score - a.score);
    }

    return results;
  }, [matches, skippedList, search, filter, sortBy, majorFilter, user]);

  const handleSkip = useCallback((userId: string) => {
    setSkippedList((prev) => [...prev, userId]);
    setLastSkipped(userId);
  }, []);

  const handleUndo = useCallback(() => {
    if (lastSkipped) {
      const id = lastSkipped;
      void undoSkipMatch(id);
      setSkippedList((prev) => prev.filter((skippedId) => skippedId !== id));
      setLastSkipped(null);
    }
  }, [lastSkipped]);

  // Get unique majors from current matches for the major filter
  const availableMajors = useMemo(() => {
    const majors = new Set(matches.map((m) => m.student.major));
    return Array.from(majors).sort();
  }, [matches]);

  if (isLoading || matchesLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5 pb-24">
      {/* Header with stats */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Discover Matches</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredMatches.length} compatible {filteredMatches.length === 1 ? 'student' : 'students'} found
            {filter !== 'all' && ' with current filters'}
            {search && ` matching "${search}"`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastSkipped && (
            <Button variant="outline" size="sm" onClick={handleUndo}>
              <Undo2 className="w-3.5 h-3.5 mr-1.5" />
              Undo
            </Button>
          )}
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, major, interests, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-10 px-3"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border flex items-center gap-1.5',
                filter === opt.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="p-4 border rounded-lg bg-muted/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Advanced Filters</h3>
              <button
                onClick={() => { setMajorFilter(null); setSortBy('compatibility'); }}
                className="text-xs text-primary hover:underline"
              >
                Reset all
              </button>
            </div>
            
            {/* Major filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Filter by Major</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setMajorFilter(null)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] rounded-full border transition-all',
                    !majorFilter
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/40'
                  )}
                >
                  All Majors
                </button>
                {availableMajors.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMajorFilter(majorFilter === m ? null : m)}
                    className={cn(
                      'px-2.5 py-1 text-[11px] rounded-full border transition-all',
                      majorFilter === m
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/40'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sort By</label>
              <div className="flex gap-2">
                {[
                  { label: 'Compatibility', value: 'compatibility' as SortType },
                  { label: 'Shared Classes', value: 'shared_classes' as SortType },
                  { label: 'Shared Interests', value: 'shared_interests' as SortType },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-md border transition-all',
                      sortBy === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/40'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results grid */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              {search || filter !== 'all' || majorFilter ? 'No matches found' : 'No matches yet'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search || filter !== 'all' || majorFilter
                ? 'Try adjusting your search or filters to see more students.'
                : 'Complete your profile with classes, interests, and availability to get better matches.'}
            </p>
          </div>
          {(search || filter !== 'all' || majorFilter) ? (
            <Button variant="outline" size="sm" onClick={() => { setSearch(''); setFilter('all'); setMajorFilter(null); }}>
              Clear Filters
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => window.location.href = '/settings/profile'}
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Complete Profile
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMatches.map(({ student, score, reasons, sharedClassesCount, sharedInterestsCount }) => (
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
              bio={student.bio}
              interests={student.interests}
              skills={student.skills}
              studyStyle={student.study_style}
              onSkip={() => handleSkip(student.user_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
