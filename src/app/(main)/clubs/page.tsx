'use client';

import { useMemo, useState } from 'react';
import { getClubs, getEvents } from '@/lib/mock-data';
import { ClubCard } from '@/components/clubs/club-card';
import { Input } from '@/components/ui/input';
import { Building2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClubsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const clubs = useMemo(() => getClubs(), []);
  const events = useMemo(() => getEvents(), []);

  const categories = useMemo(() => {
    const cats = new Set(clubs.map((c) => c.category));
    return Array.from(cats).sort();
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch =
        !search ||
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || club.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [clubs, search, categoryFilter]);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5 pb-24">
      <h1 className="text-2xl font-bold">Clubs</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter(null)}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-full border transition-all',
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
              'px-3 py-1 text-xs font-medium rounded-full border transition-all',
              categoryFilter === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Club grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            {search || categoryFilter
              ? 'No clubs match your search.'
              : 'No clubs available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredClubs.map((club) => {
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
  );
}
