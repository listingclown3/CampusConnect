'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { getAllEvents, getAllClubs, getVisibleProfiles, getUserClassIds, getUserClassIdsForUsers } from '@/lib/data/client';
import { getUserCreatedEvents } from '@/lib/data/crud-storage';
import { recommendEvents } from '@/lib/matching/events';
import { calculateMatchScore } from '@/lib/matching/score';
import { getRsvpStatus, getAttendingMap } from '@/lib/data/event-actions';
import { getUserPodIds, getPodMembersForPod } from '@/lib/data/pod-actions';
import { EventCard } from '@/components/events/event-card';
import { CreateEventDialog } from '@/components/events/create-event-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Calendar, Search, X, Sparkles, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Club, Event, RsvpStatus } from '@/types/database';

type TimeFilter = 'upcoming' | 'past' | 'this_week' | 'this_month';
type CategoryFilter = string | null;

export default function EventsPage() {
  const { user, isLoading } = useAuth();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(null);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  const [recommended, setRecommended] = useState<ReturnType<typeof recommendEvents>>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [clubsById, setClubsById] = useState<Record<string, Club>>({});
  const [rsvpByEvent, setRsvpByEvent] = useState<Record<string, RsvpStatus | null>>({});

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setDataLoading(true);
      const mockEvents = await getAllEvents();
      const userEvents = await getUserCreatedEvents();
      const events = [...mockEvents, ...userEvents];
      const clubs = await getAllClubs();
      const students = await getVisibleProfiles(user.user_id);
      const currentUserClasses = await getUserClassIds(user.user_id);
      const classIdsByUser = await getUserClassIdsForUsers(students.map((s) => s.user_id));
      if (cancelled) return;

      // Build matched user IDs
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
          if (m.user_id !== user.user_id) podMemberIds.add(m.user_id);
        }
      }

      const allConnectionIds = [...new Set([...matchedUserIds, ...podMemberIds])];
      const attendingMap = await getAttendingMap();

      const recommendations = recommendEvents(user, events, {
        attendingMap,
        matchedUserIds: allConnectionIds,
        limit: 6,
      });

      // Sort all events chronologically
      const sortedEvents = [...events].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      // Extract categories
      const cats = [...new Set(events.map((e) => e.category))].sort();

      const rsvpEntries = await Promise.all(
        events.map(async (e) => [e.id, await getRsvpStatus(e.id, user.user_id)] as const)
      );
      if (cancelled) return;

      setClubsById(Object.fromEntries(clubs.map((c) => [c.id, c])));
      setRecommended(recommendations.filter((r) => r.score > 0));
      setAllEvents(sortedEvents);
      setCategories(cats);
      setRsvpByEvent(Object.fromEntries(rsvpEntries));
      setDataLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  const now = useMemo(() => new Date(), []);

  const filteredEvents = useMemo(() => {
    let results = allEvents;

    // Time filter
    switch (timeFilter) {
      case 'upcoming':
        results = results.filter((e) => new Date(e.start_time) >= now);
        break;
      case 'past':
        results = results.filter((e) => new Date(e.start_time) < now);
        break;
      case 'this_week': {
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);
        results = results.filter((e) => {
          const d = new Date(e.start_time);
          return d >= now && d <= weekEnd;
        });
        break;
      }
      case 'this_month': {
        const monthEnd = new Date(now);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        results = results.filter((e) => {
          const d = new Date(e.start_time);
          return d >= now && d <= monthEnd;
        });
        break;
      }
    }

    // Category filter
    if (categoryFilter) {
      results = results.filter((e) => e.category === categoryFilter);
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
      );
    }

    return results;
  }, [allEvents, timeFilter, categoryFilter, search, now]);

  if (isLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campus Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover workshops, socials, career fairs, and more happening on campus.
            {allEvents.length > 0 && (
              <> <span className="font-medium text-foreground">{allEvents.filter(e => new Date(e.start_time) >= now).length}</span> upcoming events available.</>
            )}
          </p>
        </div>
        <CreateEventDialog onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events by name, description, location, or tags..."
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

      {/* Filters row */}
      <div className="space-y-3">
        {/* Time filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { label: 'Upcoming', value: 'upcoming' as TimeFilter, icon: <Calendar className="w-3 h-3" /> },
            { label: 'This Week', value: 'this_week' as TimeFilter, icon: <Clock className="w-3 h-3" /> },
            { label: 'This Month', value: 'this_month' as TimeFilter },
            { label: 'Past', value: 'past' as TimeFilter },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border flex items-center gap-1.5',
                timeFilter === opt.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter(null)}
            className={cn(
              'px-3 py-1 text-[11px] font-medium rounded-full border transition-all',
              !categoryFilter
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            )}
          >
            All Types
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
              className={cn(
                'px-3 py-1 text-[11px] font-medium rounded-full border transition-all',
                categoryFilter === cat
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended section */}
      {recommended.length > 0 && timeFilter === 'upcoming' && !search && !categoryFilter && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-lg font-semibold">Recommended For You</h2>
          </div>
          <p className="text-xs text-muted-foreground -mt-1">
            Based on your interests, major, and what your connections are attending
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommended.slice(0, 6).map((rec) => {
              const club = rec.event.club_id ? clubsById[rec.event.club_id] : undefined;
              const isPast = new Date(rec.event.start_time) < now;
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {search ? 'Search Results' : categoryFilter ? `${categoryFilter} Events` : 'All Events'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold">No events found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {search
                ? `No events matching "${search}". Try different keywords.`
                : timeFilter === 'upcoming'
                ? 'No upcoming events scheduled. Check back soon!'
                : 'No past events to show.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEvents.map((event) => {
              const club = event.club_id ? clubsById[event.club_id] : undefined;
              const isPast = new Date(event.start_time) < now;
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
  );
}
