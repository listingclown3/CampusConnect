'use client';

import { useEffect, useMemo, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useChat } from '@/lib/chat/context';
import {
  getEventById,
  getClubById,
  getStudents,
  getStudentClassIds,
} from '@/lib/mock-data';
import { recommendEvents } from '@/lib/matching/events';
import { calculateMatchScore } from '@/lib/matching/score';
import { generateEventRecommendationReason } from '@/lib/ai';
import {
  getRsvpStatus,
  setRsvpStatus,
  getEventAttendees,
  getAttendingMap,
  getOrCreateEventConversation,
  findEventConversation,
} from '@/lib/data/event-actions';
import { getUserPodIds, getPodMembersForPod } from '@/lib/data/pod-actions';
import { RsvpButtons } from '@/components/events/rsvp-buttons';
import { AttendeeList } from '@/components/events/attendee-list';
import { RecommendationReason } from '@/components/events/recommendation-reason';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatDate, formatTime } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Sparkles,
  Target,
  Building2,
  ExternalLink,
} from 'lucide-react';
import type { Profile, RsvpStatus } from '@/types/database';
import Link from 'next/link';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { refreshConversations } = useChat();

  const [rsvpStatus, setLocalRsvpStatus] = useState<RsvpStatus | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [explanation, setExplanation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  const event = useMemo(() => getEventById(eventId), [eventId]);
  const club = useMemo(
    () => (event?.club_id ? getClubById(event.club_id) : undefined),
    [event]
  );

  const isPast = event ? new Date(event.start_time) < new Date() : false;
  const isFull = event?.max_attendees
    ? event.rsvp_count >= event.max_attendees
    : false;

  // Load RSVP status
  useEffect(() => {
    if (user && event) {
      setLocalRsvpStatus(getRsvpStatus(event.id, user.user_id));
    }
  }, [user, event, refreshKey]);

  // Compute recommendation score and connections
  const { score, breakdown, reasons, attendeeInfos, matchedUserIds, podMemberIds } = useMemo(() => {
    if (!user || !event) {
      return { score: 0, breakdown: null, reasons: [], attendeeInfos: [], matchedUserIds: [] as string[], podMemberIds: new Set<string>() };
    }

    const students = getStudents();
    const currentUserClasses = getStudentClassIds(user.user_id);

    // Build matched user IDs
    const matchedIds = students
      .filter((s) => s.user_id !== user.user_id)
      .filter((s) => {
        const studentClasses = getStudentClassIds(s.user_id);
        const result = calculateMatchScore(user, s, currentUserClasses, studentClasses);
        return result.score >= 50;
      })
      .map((s) => s.user_id);

    // Pod members
    const userPodIds = getUserPodIds(user.user_id);
    const podMemIds = new Set<string>();
    for (const podId of userPodIds) {
      const members = getPodMembersForPod(podId);
      for (const m of members) {
        if (m.user_id !== user.user_id) podMemIds.add(m.user_id);
      }
    }

    const allConnectionIds = [...new Set([...matchedIds, ...podMemIds])];
    const attendingMap = getAttendingMap();

    const recs = recommendEvents(user, [event], {
      attendingMap,
      matchedUserIds: allConnectionIds,
      limit: 1,
    });

    const rec = recs[0];

    // Build attendee info
    const attendeeIds = getEventAttendees(event.id);
    const attendeeProfiles: { profile: Profile; isMatch: boolean; isPodMember: boolean }[] = [];
    for (const uid of attendeeIds) {
      if (uid === user.user_id) continue;
      const profile = students.find((s) => s.user_id === uid);
      if (profile) {
        attendeeProfiles.push({
          profile,
          isMatch: matchedIds.includes(uid),
          isPodMember: podMemIds.has(uid),
        });
      }
    }

    return {
      score: rec?.score ?? 0,
      breakdown: rec ? {
        interest_tag_match: Math.round((rec.score / 100) * 30), // Approximate breakdown
        major_relevance: rec.reasons.some((r) => r.includes('major')) ? 20 : 0,
        career_goal_relevance: rec.reasons.some((r) => r.includes('career')) ? 20 : 0,
        matches_or_pod_attending: rec.reasons.some((r) => r.includes('connections')) ? 20 : 0,
        availability_fit: rec.reasons.some((r) => r.includes('schedule')) ? 10 : 0,
      } : null,
      reasons: rec?.reasons ?? [],
      attendeeInfos: attendeeProfiles,
      matchedUserIds: matchedIds,
      podMemberIds: podMemIds,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, event, refreshKey]);

  // Compute real breakdown using the scoring logic
  const scoreBreakdown = useMemo(() => {
    if (!user || !event) return null;

    // Calculate each component individually
    const userInterests = user.interests.map((i) => i.toLowerCase());
    const eventTags = event.tags.map((t) => t.toLowerCase());
    const matchedTags = eventTags.filter((tag) =>
      userInterests.some(
        (interest) => interest.includes(tag) || tag.includes(interest)
      )
    );
    const interestScore = Math.min(
      Math.round((matchedTags.length / Math.max(eventTags.length, 1)) * 30),
      30
    );

    const MAJOR_CATEGORY_MAP: Record<string, string[]> = {
      'Computer Science': ['Technology', 'Workshop', 'Competition', 'Career'],
      'Software Engineering': ['Technology', 'Workshop', 'Competition', 'Career'],
      'Data Science': ['Technology', 'Workshop', 'Showcase', 'Career'],
      'Computer Engineering': ['Technology', 'Workshop', 'Engineering', 'Career'],
      'Electrical Engineering': ['Engineering', 'Workshop', 'Showcase'],
      'Mechanical Engineering': ['Engineering', 'Workshop', 'Showcase'],
      'Biomedical Engineering': ['Engineering', 'Health', 'Workshop'],
      'Business Administration': ['Business', 'Competition', 'Career', 'Panel'],
      'Marketing': ['Business', 'Workshop', 'Social', 'Career'],
      'Biology': ['Health', 'Academic', 'Info Session'],
      'Psychology': ['Health', 'Academic', 'Panel'],
      'Communications': ['Social', 'Workshop', 'Panel'],
      'English': ['Academic', 'Social', 'Workshop'],
      'Kinesiology': ['Health', 'Social'],
      'Graphic Design': ['Art', 'Workshop', 'Showcase'],
      'Environmental Science': ['Academic', 'Workshop'],
    };
    const relevantCategories = MAJOR_CATEGORY_MAP[user.major] ?? [];
    const majorScore = relevantCategories.includes(event.category) ? 20 : 0;

    const goalKeywords = user.career_goals.flatMap((g) => g.toLowerCase().split(/\s+/));
    const eventText = `${event.title} ${event.description}`.toLowerCase();
    const goalMatches = goalKeywords.filter((kw) => kw.length > 3 && eventText.includes(kw));
    const careerScore = Math.min(
      Math.round((goalMatches.length / Math.max(goalKeywords.length, 1)) * 60),
      20
    );

    const attendingMap = getAttendingMap();
    const eventAttendees = attendingMap[event.id] ?? [];
    const allConnections = [...new Set([...matchedUserIds, ...podMemberIds])];
    const connectionsAttending = eventAttendees.filter((uid) => allConnections.includes(uid));
    const attendScore = Math.min(connectionsAttending.length * 5, 20);

    const eventDate = new Date(event.start_time);
    const dayIndex = eventDate.getUTCDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const dayName = dayNames[dayIndex];
    const hour = eventDate.getUTCHours();
    let timeSlot: 'morning' | 'afternoon' | 'evening' | 'late_night';
    if (hour < 12) timeSlot = 'morning';
    else if (hour < 17) timeSlot = 'afternoon';
    else if (hour < 21) timeSlot = 'evening';
    else timeSlot = 'late_night';
    const availScore = user.availability[dayName]?.[timeSlot] ? 10 : 0;

    return {
      interest_tag_match: interestScore,
      major_relevance: majorScore,
      career_goal_relevance: careerScore,
      matches_or_pod_attending: attendScore,
      availability_fit: availScore,
    };
  }, [user, event, matchedUserIds, podMemberIds]);

  // Generate explanation
  useEffect(() => {
    if (!user || !event) return;

    const currentUser = user;
    const currentEvent = event;

    async function generate() {
      setIsGenerating(true);
      try {
        const userInterests = currentUser.interests.map((i) => i.toLowerCase());
        const eventTags = currentEvent.tags.map((t) => t.toLowerCase());
        const matchedTags = eventTags.filter((tag) =>
          userInterests.some(
            (interest) => interest.includes(tag) || tag.includes(interest)
          )
        );
        const reason = await generateEventRecommendationReason(
          currentUser,
          currentEvent,
          matchedTags
        );
        setExplanation(reason);
      } catch {
        setExplanation('This event is a great opportunity to meet other students and expand your network.');
      }
      setIsGenerating(false);
    }

    generate();
  }, [user, event]);

  const handleRsvp = (status: RsvpStatus) => {
    if (!user || !event || isPast) return;
    // Toggle off if already selected
    if (rsvpStatus === status) {
      setLocalRsvpStatus(null);
      // We still store the last action; just toggle
    } else {
      setRsvpStatus(event.id, user.user_id, status);
      setLocalRsvpStatus(status);
    }
    setRefreshKey((k) => k + 1);
  };

  const handleJoinChat = () => {
    if (!user || !event) return;
    const conv = getOrCreateEventConversation(event.id, event.title, user.user_id);
    refreshConversations();
    router.push(`/chat/${conv.id}`);
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
  if (!event) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Event not found</h2>
            <p className="text-sm text-muted-foreground">
              This event doesn&apos;t exist or has been removed.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/events')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Events
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

      {/* Event header */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{event.title}</h1>
            {club && (
              <Link
                href={`/clubs/${club.id}`}
                className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                <Building2 className="w-3.5 h-3.5" />
                {club.name}
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
          {isPast && (
            <Badge variant="secondary" className="flex-shrink-0">
              Past Event
            </Badge>
          )}
          {isFull && !isPast && (
            <Badge variant="destructive" className="flex-shrink-0">
              Full
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>

        {/* Event details */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(event.start_time)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {event.rsvp_count} attending
            {event.max_attendees && ` / ${event.max_attendees} max`}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {event.category}
          </Badge>
          {event.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* RSVP buttons */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold">RSVP</h3>
          <RsvpButtons
            currentStatus={rsvpStatus}
            onStatusChange={handleRsvp}
            disabled={isPast}
          />
          {isPast && (
            <p className="text-xs text-muted-foreground">
              This event has already passed. RSVP is no longer available.
            </p>
          )}
          {rsvpStatus === 'going' && !isPast && (
            <Button
              variant="default"
              size="sm"
              className="mt-2"
              onClick={handleJoinChat}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Join Event Chat
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recommendation explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Why We Recommend This
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">{explanation}</p>
              {reasons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason, idx) => (
                    <RecommendationReason key={idx} reason={reason} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Score breakdown */}
      {scoreBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Recommendation Score: {score}/100
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Interest Tag Match', value: scoreBreakdown.interest_tag_match, max: 30 },
              { label: 'Major Relevance', value: scoreBreakdown.major_relevance, max: 20 },
              { label: 'Career Goal Relevance', value: scoreBreakdown.career_goal_relevance, max: 20 },
              { label: 'Connections Attending', value: scoreBreakdown.matches_or_pod_attending, max: 20 },
              { label: 'Availability Fit', value: scoreBreakdown.availability_fit, max: 10 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}/{item.max}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      item.value >= item.max * 0.7
                        ? 'bg-green-500'
                        : item.value >= item.max * 0.4
                          ? 'bg-amber-500'
                          : 'bg-gray-300'
                    )}
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Attendee list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Who&apos;s Going
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendeeList attendees={attendeeInfos} />
        </CardContent>
      </Card>
    </div>
  );
}
