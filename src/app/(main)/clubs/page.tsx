'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAllClubs, getAllEvents } from '@/lib/data/client';
import { getUserCreatedClubs } from '@/lib/data/crud-storage';
import { ClubCard } from '@/components/clubs/club-card';
import { CreateClubDialog } from '@/components/clubs/create-club-dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Search, X, Users, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Club, Event } from '@/types/database';

type SortType = 'popular' | 'name' | 'events';

export default function ClubsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDataLoading(true);
      const [allClubs, allEvents, userClubs] = await Promise.all([getAllClubs(), getAllEvents(), getUserCreatedClubs()]);
      if (cancelled) return;
      setClubs([...allClubs, ...userClubs]);
      setEvents(allEvents);
      setDataLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const categories = useMemo(() => {
    const cats = new Set(clubs.map((c) => c.category));
    return Array.from(cats).sort();
  }, [clubs]);

  const clubsWithEvents = useMemo(() => {
    return clubs.map((club) => ({
      club,
      eventCount: events.filter((e) => e.club_id === club.id).length,
    }));
  }, [clubs, events]);

  const filteredClubs = useMemo(() => {
    let results = clubsWithEvents;

    // Search
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(({ club }) =>
        club.name.toLowerCase().includes(q) ||
        club.description.toLowerCase().includes(q) ||
        club.tags.some((t) => t.toLowerCase().includes(q)) ||
        club.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter) {
      results = results.filter(({ club }) => club.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        results.sort((a, b) => b.club.member_count - a.club.member_count);
        break;
      case 'name':
        results.sort((a, b) => a.club.name.localeCompare(b.club.name));
        break;
      case 'events':
        results.sort((a, b) => b.eventCount - a.eventCount);
        break;
    }

    return results;
  }, [clubsWithEvents, search, categoryFilter, sortBy]);

  // Stats
  const totalMembers = clubs.reduce((sum, c) => sum + c.member_count, 0);
  const totalEvents = events.length;

  if (dataLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
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
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campus Clubs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore <span className="font-medium text-foreground">{clubs.length}</span> active student organizations
            with <span className="font-medium text-foreground">{totalMembers.toLocaleString()}</span> total members
            and <span className="font-medium text-foreground">{totalEvents}</span> scheduled events.
          </p>
        </div>
        <CreateClubDialog onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
          <Building2 className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{clubs.length}</p>
            <p className="text-[10px] text-blue-600/70">Active Clubs</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
          <Users className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">{totalMembers.toLocaleString()}</p>
            <p className="text-[10px] text-green-600/70">Total Members</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
          <Calendar className="w-4 h-4 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{totalEvents}</p>
            <p className="text-[10px] text-amber-600/70">Events</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clubs by name, description, or tags..."
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
      <div className="flex items-center justify-between gap-4">
        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
          <button
            onClick={() => setCategoryFilter(null)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap',
              !categoryFilter
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:text-foreground'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap',
                categoryFilter === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 shrink-0">
          {[
            { label: 'Popular', value: 'popular' as SortType, icon: <TrendingUp className="w-3 h-3" /> },
            { label: 'A-Z', value: 'name' as SortType },
            { label: 'Events', value: 'events' as SortType, icon: <Calendar className="w-3 h-3" /> },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={cn(
                'px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all flex items-center gap-1',
                sortBy === opt.value
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Club grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold">No clubs found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {search || categoryFilter
              ? 'No clubs match your search criteria. Try different keywords or clear the filter.'
              : 'No clubs available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClubs.map(({ club, eventCount }) => (
            <ClubCard
              key={club.id}
              club={club}
              eventCount={eventCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
