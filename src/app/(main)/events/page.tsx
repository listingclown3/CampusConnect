'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { getEvents, getClubById, getStudents, getStudentClassIds } from '@/lib/mock-data';
import { recommendEvents } from '@/lib/matching/events';
import { calculateMatchScore } from '@/lib/matching/score';
import { getRsvpStatus, getAttendingMap } from '@/lib/data/event-actions';
import { getUserPodIds, getPodMembersForPod } from '@/lib/data/pod-actions';
import { EventCard } from '@/components/events/event-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  const { recommended, allEvents } = useMemo(() => {
    if (!user) return { recommended: [], allEvents: [] };

    const events = getEvents();
    const students = getStudents();
    const currentUserClasses = getStudentClassIds(user.user_id);

    // Build matched user IDs
    const matchedUserIds = students
      .filter((s) => s.user_id !== user.user_id)
      .filter((s) => {
        const studentClasses = getStudentClassIds(s.user_id);
        const result = calculateMatchScore(user, s, currentUserClasses, studentClasses);
        return result.score >= 50;
      })
      .map((s) => s.user_id);

    // Get pod member user IDs
    const userPodIds = getUserPodIds(user.user_id);
    const podMemberIds = new Set<string>();
    for (const podId of userPodIds) {
      const members = getPodMembersForPod(podId);
      for (const m of members) {
        if (m.user_id !== user.user_id) podMemberIds.add(m.user_id);
      }
    }

    const allConnectionIds = [...new Set([...matchedUserIds, ...podMemberIds])];
    const attendingMap = getAttendingMap();

    const recommendations = recommendEvents(user, events, {
      attendingMap,
      matchedUserIds: allConnectionIds,
      limit: 8,
    });

    // Sort all events chronologically
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return {
      recommended: recommendations.filter((r) => r.score > 0),
      allEvents: sortedEvents,
    };
  }, [user]);

  const now = useMemo(() => new Date(), []);
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const eventDate = new Date(event.start_time);
      return filter === 'upcoming' ? eventDate >= now : eventDate < now;
    });
  }, [allEvents, filter, now]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6 pb-24">
      <h1 className="text-2xl font-bold">Events</h1>

      {/* Recommended section */}
      {recommended.length > 0 && filter === 'upcoming' && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Recommended For You</h2>
          <div className="grid gap-3">
            {recommended.map((rec) => {
              const club = rec.event.club_id ? getClubById(rec.event.club_id) : undefined;
              const isPast = new Date(rec.event.start_time) < now;
              const rsvpStatus = user ? getRsvpStatus(rec.event.id, user.user_id) : null;
              return (
                <EventCard
                  key={rec.event.id}
                  event={rec.event}
                  clubName={club?.name}
                  rsvpStatus={rsvpStatus}
                  recommendationReason={rec.reasons[0]}
                  isPast={isPast}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Filter tabs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">All Events</h2>
          <div className="flex gap-1 p-0.5 bg-muted rounded-md">
            <button
              onClick={() => setFilter('upcoming')}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded transition-all',
                filter === 'upcoming'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded transition-all',
                filter === 'past'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Past
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              {filter === 'upcoming'
                ? 'No upcoming events scheduled.'
                : 'No past events to show.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredEvents.map((event) => {
              const club = event.club_id ? getClubById(event.club_id) : undefined;
              const isPast = new Date(event.start_time) < now;
              const rsvpStatus = user ? getRsvpStatus(event.id, user.user_id) : null;
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  clubName={club?.name}
                  rsvpStatus={rsvpStatus}
                  isPast={isPast}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
