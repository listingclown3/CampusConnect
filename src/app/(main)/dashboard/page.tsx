'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Calendar, Users, MessageCircle, BookOpen, Target, Zap } from 'lucide-react';
import {
  getStudents,
  getStudentClassIds,
  getUserPods,
  getUserConversations,
  getEvents,
  getPodMembers,
  getPods,
  getStudentClasses,
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
      return { student, score: result.score, reasons: result.reasons };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4);
  }, [user]);

  const recommendedPod = useMemo(() => {
    if (!user) return null;
    const userPods = getUserPods(user.user_id);
    const allPods = getPods();
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

  const upcomingEvents = useMemo(() => {
    const events = getEvents();
    const now = new Date();
    const sorted = [...events]
      .filter((e) => new Date(e.start_time) >= now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    return sorted.slice(0, 3);
  }, []);

  const stats = useMemo(() => {
    if (!user) return { totalMatches: 0, podsJoined: 0, unreadMessages: 0, classesEnrolled: 0 };
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
    const unreadMessages = Math.min(conversations.length, 3);
    const classesEnrolled = getStudentClasses(user.user_id).length;
    return { totalMatches: matchCount, podsJoined, unreadMessages, classesEnrolled };
  }, [user]);

  // Compute quick insights
  const insights = useMemo(() => {
    if (!user) return [];
    const items: { icon: React.ReactNode; text: string; color: string }[] = [];

    if (stats.totalMatches > 15) {
      items.push({
        icon: <TrendingUp className="w-3.5 h-3.5" />,
        text: `You have ${stats.totalMatches} compatible students - that's above average!`,
        color: 'text-green-600 bg-green-50 dark:bg-green-950/20',
      });
    }

    if (topMatches.length > 0 && topMatches[0].score >= 80) {
      items.push({
        icon: <Sparkles className="w-3.5 h-3.5" />,
        text: `Your top match is ${topMatches[0].score}% compatible - highly aligned with your interests`,
        color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20',
      });
    }

    if (upcomingEvents.length > 0) {
      items.push({
        icon: <Calendar className="w-3.5 h-3.5" />,
        text: `${upcomingEvents.length} events coming up that match your profile`,
        color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
      });
    }

    if (stats.classesEnrolled > 0) {
      items.push({
        icon: <BookOpen className="w-3.5 h-3.5" />,
        text: `Enrolled in ${stats.classesEnrolled} classes - classmates are among your best matches`,
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
      });
    }

    return items.slice(0, 3);
  }, [user, stats, topMatches, upcomingEvents]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
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
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6 pb-24">
      {/* Welcome section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.first_name || 'Spartan'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your circle today. Your compatibility data updates in real-time as you refine your profile.
        </p>
      </div>

      {/* Quick Stats */}
      <StatsBar
        totalMatches={stats.totalMatches}
        podsJoined={stats.podsJoined}
        unreadMessages={stats.unreadMessages}
      />

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm ${insight.color}`}
            >
              {insight.icon}
              <span className="text-xs font-medium">{insight.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top Matches - grid layout */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Top Matches
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Students most compatible with your profile, interests, and schedule
            </p>
          </div>
          <Link
            href="/matches"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {topMatches.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <Users className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Complete your profile to see matches!
              </p>
              <p className="text-xs text-muted-foreground">
                Add your classes, interests, and availability for the best results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topMatches.map(({ student, score, reasons }) => (
                <MatchPreviewCard
                  key={student.user_id}
                  userId={student.user_id}
                  name={`${student.first_name} ${student.last_name}`}
                  major={student.major}
                  compatibility={score}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom row: Pod + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recommended Pod */}
        {recommendedPod && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Recommended Pod
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ranked by schedule and interest overlap
                  </p>
                </div>
                <Link href="/pods" className="text-xs text-primary hover:underline flex items-center gap-1">
                  All pods <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <PodPreviewCard
                podId={recommendedPod.pod.id}
                name={recommendedPod.pod.name}
                podType={recommendedPod.pod.pod_type}
                memberCount={recommendedPod.memberCount}
                score={recommendedPod.pod.score}
              />
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Score is based on shared interests, goals, and availability overlap
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming Events
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Next happenings relevant to your interests
                </p>
              </div>
              <Link href="/events" className="text-xs text-primary hover:underline flex items-center gap-1">
                All events <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No upcoming events. Check back soon!
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <EventPreviewCard
                  key={event.id}
                  eventId={event.id}
                  title={event.title}
                  startTime={event.start_time}
                  location={event.location}
                  rsvpCount={event.rsvp_count}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions tip */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Quick tip</p>
          <p className="text-xs text-muted-foreground">
            Message your top matches to start building connections! The best collaborations start with a simple &ldquo;Hey, I noticed we share interests in...&rdquo;
          </p>
        </div>
        <Link href="/chat" className="text-xs text-primary hover:underline font-medium shrink-0">
          Open Chat
        </Link>
      </div>
    </div>
  );
}
