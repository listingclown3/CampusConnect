'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getStudents,
  getStudentClassIds,
  getUserPods,
  getUserConversations,
  getEvents,
  getPodMembers,
  getPods,
} from '@/lib/mock-data';
import { calculateMatchScore } from '@/lib/matching/score';
import { getHiddenUserIds } from '@/lib/data/safety-actions';
import { MatchPreviewCard } from '@/components/dashboard/match-preview-card';
import { PodPreviewCard } from '@/components/dashboard/pod-preview-card';
import { EventPreviewCard } from '@/components/dashboard/event-preview-card';
import { StatsBar } from '@/components/dashboard/stats-bar';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  const topMatches = useMemo(() => {
    if (!user) return [];
    const hiddenIds = getHiddenUserIds(user.user_id);
    const students = getStudents().filter((s) => s.user_id !== user.user_id && s.is_visible && !hiddenIds.includes(s.user_id));
    const currentUserClasses = getStudentClassIds(user.user_id);

    const scored = students.map((student) => {
      const studentClasses = getStudentClassIds(student.user_id);
      const result = calculateMatchScore(user, student, currentUserClasses, studentClasses);
      return { student, score: result.score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [user]);

  const recommendedPod = useMemo(() => {
    if (!user) return null;
    const userPods = getUserPods(user.user_id);
    const allPods = getPods();
    // Recommend the highest-scored pod the user is NOT already in
    const userPodIds = new Set(userPods.map((p) => p.id));
    const available = allPods
      .filter((p) => !userPodIds.has(p.id) && p.is_active)
      .sort((a, b) => b.score - a.score);
    if (available.length === 0 && allPods.length > 0) {
      return { pod: allPods[0], memberCount: getPodMembers(allPods[0].id).length };
    }
    if (available.length === 0) return null;
    return { pod: available[0], memberCount: getPodMembers(available[0].id).length };
  }, [user]);

  const upcomingEvent = useMemo(() => {
    const events = getEvents();
    // Sort by start_time and return the earliest upcoming one
    const sorted = [...events].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    return sorted[0] || null;
  }, []);

  const stats = useMemo(() => {
    if (!user) return { totalMatches: 0, podsJoined: 0, unreadMessages: 0 };
    const hiddenIds = getHiddenUserIds(user.user_id);
    const students = getStudents().filter((s) => s.user_id !== user.user_id && s.is_visible && !hiddenIds.includes(s.user_id));
    const currentUserClasses = getStudentClassIds(user.user_id);
    const matchCount = students.filter((student) => {
      const studentClasses = getStudentClassIds(student.user_id);
      const result = calculateMatchScore(user, student, currentUserClasses, studentClasses);
      return result.score > 0;
    }).length;
    const podsJoined = getUserPods(user.user_id).length;
    const conversations = getUserConversations(user.user_id);
    // Simulate unread messages count
    const unreadMessages = Math.min(conversations.length, 3);
    return { totalMatches: matchCount, podsJoined, unreadMessages };
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.first_name || 'Spartan'}!
        </h1>
        <p className="text-muted-foreground">
          Here is what is happening in your circle today.
        </p>
      </div>

      {/* Quick Stats */}
      <StatsBar
        totalMatches={stats.totalMatches}
        podsJoined={stats.podsJoined}
        unreadMessages={stats.unreadMessages}
      />

      {/* Top Matches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Top Matches</CardTitle>
          <Link
            href="/matches"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {topMatches.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Complete your profile to see matches!
            </p>
          ) : (
            topMatches.map(({ student, score }) => (
              <MatchPreviewCard
                key={student.user_id}
                userId={student.user_id}
                name={`${student.first_name} ${student.last_name}`}
                major={student.major}
                compatibility={score}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Bottom row: Pod + Event */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recommended Pod */}
        {recommendedPod && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recommended Pod
            </h2>
            <PodPreviewCard
              podId={recommendedPod.pod.id}
              name={recommendedPod.pod.name}
              podType={recommendedPod.pod.pod_type}
              memberCount={recommendedPod.memberCount}
              score={recommendedPod.pod.score}
            />
          </div>
        )}

        {/* Upcoming Event */}
        {upcomingEvent && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Upcoming Event
            </h2>
            <EventPreviewCard
              eventId={upcomingEvent.id}
              title={upcomingEvent.title}
              startTime={upcomingEvent.start_time}
              location={upcomingEvent.location}
              rsvpCount={upcomingEvent.rsvp_count}
            />
          </div>
        )}
      </div>
    </div>
  );
}
