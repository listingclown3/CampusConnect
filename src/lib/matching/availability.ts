import type { Availability, DayOfWeek, TimeSlot } from '@/types/database';

const DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const TIME_SLOTS: TimeSlot[] = [
  'morning',
  'afternoon',
  'evening',
  'late_night',
];

export interface TimeSlotInfo {
  day: DayOfWeek;
  slot: TimeSlot;
}

/**
 * Count the number of overlapping available time slots between two users.
 */
export function getAvailabilityOverlap(
  a: Availability,
  b: Availability
): TimeSlotInfo[] {
  const overlapping: TimeSlotInfo[] = [];

  for (const day of DAYS) {
    for (const slot of TIME_SLOTS) {
      if (a[day]?.[slot] && b[day]?.[slot]) {
        overlapping.push({ day, slot });
      }
    }
  }

  return overlapping;
}

/**
 * Find the best meeting time(s) from overlapping availability.
 * Prefers afternoon and evening slots on weekdays, then weekends.
 */
export function findBestMeetingTime(
  a: Availability,
  b: Availability,
  maxResults: number = 3
): TimeSlotInfo[] {
  const overlap = getAvailabilityOverlap(a, b);

  if (overlap.length === 0) return [];

  // Score each slot - prefer weekday afternoons/evenings
  const scored = overlap.map((slot) => {
    let score = 0;
    const isWeekday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(slot.day);

    if (isWeekday) score += 2;
    if (slot.slot === 'afternoon') score += 3;
    if (slot.slot === 'evening') score += 2;
    if (slot.slot === 'morning') score += 1;
    // late_night gets 0 bonus

    return { ...slot, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map(({ day, slot }) => ({ day, slot }));
}

/**
 * Calculate normalized availability overlap score (0-15 range for matching).
 * 0 overlapping slots = 0, 7+ = 15 (max score)
 */
export function calculateAvailabilityScore(
  a: Availability,
  b: Availability
): number {
  const overlap = getAvailabilityOverlap(a, b);
  const count = overlap.length;

  // Normalize: 0 slots = 0, 1-2 = 5, 3-4 = 8, 5-6 = 11, 7+ = 15
  if (count === 0) return 0;
  if (count <= 2) return 5;
  if (count <= 4) return 8;
  if (count <= 6) return 11;
  return 15;
}
