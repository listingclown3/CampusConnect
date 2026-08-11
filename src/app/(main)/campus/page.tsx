'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { getAllEvents, getAllClubs, getVisibleProfiles, getUserClassIds, getUserClassIdsForUsers } from '@/lib/data/client';
import { recommendEvents } from '@/lib/matching/events';
import { calculateMatchScore } from '@/lib/matching/score';
import { getRsvpStatus, getAttendingMap } from '@/lib/data/event-actions';
import { getUserPodIds, getPodMembersForPod } from '@/lib/data/pod-actions';
import { EventCard } from '@/components/events/event-card';
import { ClubCard } from '@/components/clubs/club-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Club, Event, RsvpStatus } from '@/types/database';

export default function CampusPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'clubs'>('events');
  const [dataLoading, setDataLoading] = useState(true);

  const [recommended, setRecommended] = useState<ReturnType<typeof recommendEvents>>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [clubsById, setClubsById] = useState<Record<string, Club>>({});
  const [rsvpByEvent, setRsvpByEvent] = useState<Record<string, RsvpStatus | null>>({});

  // Event recommendations
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setDataLoading(true);
      const [allEventsData, allClubsData, students, currentUserClasses] = await Promise.all([
        getAllEvents(),
        getAllClubs(),
        getVisibleProfiles(user.user_id),
        getUserClassIds(user.user_id),
      ]);
      if (cancelled) return;

      const classIdsByUser = await getUserClassIdsForUsers(students.map((s) => s.user_id));
      if (cancelled) return;

      // Build matched user IDs (users with score > 50)
      const matchedUserIds = students
        .filter((s) => {
          const studentClasses = classIdsByUser[s.user_id] ?? [];
          const result = calculateMatchScore(user, s, currentUserClasses, studentClasses);
          return result.score >= 50;
        })
        .map((s) => s.user_id);

      // Get pod member user IDs
      const userPodIds = await getUserPodIds(user.user_id);
      const podMemberIds = new Set<string>();
      for (const podId of userPodIds) {
        const members = await getPodMembersForPod(podId);
        for (const m of members) {
          if (m.user_id !== user.user_id) {
            podMemberIds.add(m.user_id);
          }
        }
      }
      if (cancelled) return;

      const allConnectionIds = [...new Set([...matchedUserIds, ...podMemberIds])];
      const attendingMap = await getAttendingMap();
      if (cancelled) return;

      const recommendations = recommendEvents(user, allEventsData, {
        attendingMap,
        matchedUserIds: allConnectionIds,
        limit: 6,
      });

      // Sort all events chronologically
      const sortedEvents = [...allEventsData].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      const rsvpEntries = await Promise.all(
        allEventsData.map(async (e) => [e.id, await getRsvpStatus(e.id, user.user_id)] as const)
      );
      if (cancelled) return;

      setClubsById(Object.fromEntries(allClubsData.map((c) => [c.id, c])));
      setRecommended(recommendations.filter((r) => r.score > 0));
      setAllEvents(sortedEvents);
      setClubs(allClubsData);
      setEvents(allEventsData);
      setRsvpByEvent(Object.fromEntries(rsvpEntries));
      setDataLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5 pb-24">
      <h1 className="text-2xl font-bold">Campus</h1>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('events')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all',
            activeTab === 'events'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Calendar className="w-4 h-4" />
          Events
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all',
            activeTab === 'clubs'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Building2 className="w-4 h-4" />
          Clubs
        </button>
      </div>

      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Recommended events */}
          {recommended.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Recommended For You</h2>
              <div className="grid gap-3">
                {recommended.slice(0, 4).map((rec) => {
                  const club = rec.event.club_id ? clubsById[rec.event.club_id] : undefined;
                  const isPast = new Date(rec.event.start_time) < new Date();
                  const rsvpStatus = rsvpByEvent[rec.event.id] ?? null;
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

          {/* All events */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">All Events</h2>
            {allEvents.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No events scheduled yet.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {allEvents.slice(0, 8).map((event) => {
                  const club = event.club_id ? clubsById[event.club_id] : undefined;
                  const isPast = new Date(event.start_time) < new Date();
                  const rsvpStatus = rsvpByEvent[event.id] ?? null;
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
      )}

      {activeTab === 'clubs' && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">All Clubs</h2>
          {clubs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No clubs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clubs.map((club) => {
                const clubEvents = events.filter((e) => e.club_id === club.id);
                return (
                  <ClubCard
                    key={club.id}
                    club={club}
                    eventCount={clubEvents.length}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
