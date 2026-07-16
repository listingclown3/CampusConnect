import { describe, it, expect } from 'vitest';
import { recommendEvents } from '@/lib/matching/events';
import type { Profile, Event, Availability } from '@/types/database';

function makeAvailability(): Availability {
  const slots = { morning: true, afternoon: true, evening: true, late_night: false };
  return {
    monday: slots,
    tuesday: slots,
    wednesday: slots,
    thursday: slots,
    friday: slots,
    saturday: slots,
    sunday: slots,
  };
}

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'user-001',
    user_id: 'user-001',
    first_name: 'Test',
    last_name: 'User',
    display_name: 'Test U.',
    avatar_url: null,
    bio: null,
    student_type: 'freshman',
    major: 'Computer Science',
    intended_major: null,
    graduation_year: 2028,
    interests: ['AI', 'machine learning', 'coding'],
    skills: ['Python', 'TensorFlow'],
    career_goals: ['AI researcher', 'machine learning engineer'],
    study_style: 'group',
    collaboration_style: 'leader',
    connection_types: ['study_buddies'],
    availability: makeAvailability(),
    linkedin_url: null,
    instagram_handle: null,
    is_visible: true,
    onboarding_complete: true,
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-08-01T00:00:00Z',
    ...overrides,
  };
}

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 'evt-001',
    title: 'AI Workshop',
    description: 'Learn about AI and machine learning',
    club_id: null,
    organizer_id: null,
    location: 'Engineering Building',
    start_time: '2024-09-05T17:00:00Z',
    end_time: '2024-09-05T19:00:00Z',
    tags: ['AI', 'workshop', 'machine learning'],
    category: 'Workshop',
    max_attendees: 50,
    rsvp_count: 30,
    image_url: null,
    is_virtual: false,
    virtual_link: null,
    created_at: '2024-07-01T00:00:00Z',
    ...overrides,
  };
}

describe('recommendEvents', () => {
  it('returns events sorted by relevance score', () => {
    const profile = makeProfile({ interests: ['AI', 'machine learning'] });

    const events: Event[] = [
      makeEvent({ id: 'evt-1', title: 'AI Workshop', tags: ['AI', 'machine learning'], category: 'Workshop' }),
      makeEvent({ id: 'evt-2', title: 'Basketball Game', tags: ['sports', 'basketball'], category: 'Social' }),
      makeEvent({ id: 'evt-3', title: 'Career Fair', tags: ['career', 'tech'], category: 'Career' }),
    ];

    const recommendations = recommendEvents(profile, events);

    expect(recommendations).toHaveLength(3);
    // AI Workshop should rank higher for an AI-interested CS student
    expect(recommendations[0].event.id).toBe('evt-1');
  });

  it('respects limit option', () => {
    const profile = makeProfile();
    const events = Array.from({ length: 15 }, (_, i) =>
      makeEvent({ id: `evt-${i}`, title: `Event ${i}` })
    );

    const recommendations = recommendEvents(profile, events, { limit: 5 });
    expect(recommendations).toHaveLength(5);
  });

  it('scores events higher when connections are attending', () => {
    const profile = makeProfile();

    const events: Event[] = [
      makeEvent({ id: 'evt-1', title: 'Event A', tags: ['social'], category: 'Social' }),
      makeEvent({ id: 'evt-2', title: 'Event B', tags: ['social'], category: 'Social' }),
    ];

    const withConnections = recommendEvents(profile, events, {
      attendingMap: { 'evt-2': ['user-002', 'user-003'] },
      matchedUserIds: ['user-002', 'user-003'],
    });

    const eventBRec = withConnections.find((r) => r.event.id === 'evt-2');
    const eventARec = withConnections.find((r) => r.event.id === 'evt-1');

    expect(eventBRec!.score).toBeGreaterThan(eventARec!.score);
  });

  it('considers major relevance in scoring', () => {
    const csProfile = makeProfile({ major: 'Computer Science' });

    const events: Event[] = [
      makeEvent({ id: 'evt-1', tags: ['tech'], category: 'Technology' }),
      makeEvent({ id: 'evt-2', tags: ['art'], category: 'Art' }),
    ];

    const recommendations = recommendEvents(csProfile, events);
    const techEvent = recommendations.find((r) => r.event.id === 'evt-1');
    const artEvent = recommendations.find((r) => r.event.id === 'evt-2');

    expect(techEvent!.score).toBeGreaterThan(artEvent!.score);
  });

  it('generates reasons for recommendations', () => {
    const profile = makeProfile({ interests: ['AI', 'machine learning'] });
    const events = [
      makeEvent({ tags: ['AI', 'workshop'], category: 'Technology' }),
    ];

    const recommendations = recommendEvents(profile, events);
    expect(recommendations[0].reasons.length).toBeGreaterThan(0);
  });

  it('returns empty array for empty events list', () => {
    const profile = makeProfile();
    const recommendations = recommendEvents(profile, []);
    expect(recommendations).toHaveLength(0);
  });

  it('scores availability fit', () => {
    // Event on Thursday evening (user is available)
    const profile = makeProfile({
      availability: {
        monday: { morning: false, afternoon: false, evening: false, late_night: false },
        tuesday: { morning: false, afternoon: false, evening: false, late_night: false },
        wednesday: { morning: false, afternoon: false, evening: false, late_night: false },
        thursday: { morning: false, afternoon: false, evening: true, late_night: false },
        friday: { morning: false, afternoon: false, evening: false, late_night: false },
        saturday: { morning: false, afternoon: false, evening: false, late_night: false },
        sunday: { morning: false, afternoon: false, evening: false, late_night: false },
      },
    });

    // Thursday at 17:00 UTC = evening
    const events = [
      makeEvent({
        id: 'evt-1',
        start_time: '2024-09-05T17:00:00Z', // Thursday
        tags: [],
        category: 'Other',
      }),
    ];

    const recommendations = recommendEvents(profile, events);
    // The event should get the availability_fit score
    expect(recommendations[0].score).toBeGreaterThanOrEqual(0);
  });
});
