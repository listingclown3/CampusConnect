'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { getClubById, getAllEvents } from '@/lib/data/client';
import {
  isUserInClub,
  joinClub,
  leaveClub,
  getClubMemberCount,
  getRsvpStatus,
} from '@/lib/data/event-actions';
import { EventCard } from '@/components/events/event-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  Clock,
  MapPin,
  Check,
  LogOut,
  Globe,
} from 'lucide-react';
import { CalendarExportButton } from '@/components/calendar/calendar-export-button';
import type { Club, Event, RsvpStatus } from '@/types/database';

export default function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: clubId } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  const [club, setClub] = useState<Club | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [rsvpByEvent, setRsvpByEvent] = useState<Record<string, RsvpStatus | null>>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setDataLoading(true);
      const c = await getClubById(clubId);
      if (cancelled) return;
      setClub(c);

      if (!c) {
        setDataLoading(false);
        return;
      }

      const allEvents = await getAllEvents();
      const events = allEvents
        .filter((e) => e.club_id === c.id)
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

      const [member, count, rsvpEntries] = await Promise.all([
        user ? isUserInClub(c.id, user.user_id) : Promise.resolve(false),
        getClubMemberCount(c.id, c.member_count),
        user
          ? Promise.all(events.map(async (e) => [e.id, await getRsvpStatus(e.id, user.user_id)] as const))
          : Promise.resolve([]),
      ]);
      if (cancelled) return;

      setClubEvents(events);
      setIsMember(member);
      setMemberCount(count);
      setRsvpByEvent(Object.fromEntries(rsvpEntries));
      setDataLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [clubId, user, refreshKey]);

  const handleJoin = async () => {
    if (!user || !club) return;
    await joinClub(club.id, user.user_id);
    setRefreshKey((k) => k + 1);
  };

  const handleLeave = async () => {
    if (!user || !club) return;
    await leaveClub(club.id, user.user_id);
    setRefreshKey((k) => k + 1);
  };

  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // 404 state
  if (!club) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Club not found</h2>
            <p className="text-sm text-muted-foreground">
              This club doesn&apos;t exist or has been deactivated.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/clubs')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Club header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{club.name}</h1>
          </div>
          <Badge variant="outline">{club.category}</Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {club.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {memberCount} members
          </span>
          {club.meeting_schedule && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {club.meeting_schedule}
            </span>
          )}
          {club.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {club.location}
            </span>
          )}
        </div>

        {/* Tags */}
        {club.tags && club.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {club.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Contact info */}
        {(club.instagram_handle || club.website_url) && (
          <div className="flex flex-wrap gap-3 text-sm">
            {club.instagram_handle && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Globe className="w-3.5 h-3.5" />
                {club.instagram_handle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Join/Leave button */}
      <div className="flex gap-3">
        {isMember ? (
          <Button variant="outline" onClick={handleLeave} className="text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-1.5" />
            Leave Club
          </Button>
        ) : (
          <Button onClick={handleJoin}>
            <Check className="w-4 h-4 mr-1.5" />
            Join Club
          </Button>
        )}
        {club.meeting_schedule && (
          <CalendarExportButton
            type="club"
            data={{
              name: club.name,
              description: club.description,
              meeting_schedule: club.meeting_schedule,
              location: club.location,
            }}
          />
        )}
      </div>

      {/* Upcoming events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events by {club.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {clubEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events scheduled for this club yet.
            </p>
          ) : (
            <div className="grid gap-3">
              {clubEvents.map((event) => {
                const isPast = new Date(event.start_time) < new Date();
                const rsvpStatus = rsvpByEvent[event.id] ?? null;
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    clubName={club.name}
                    rsvpStatus={rsvpStatus}
                    isPast={isPast}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
