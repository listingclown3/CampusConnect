import { describe, it, expect } from 'vitest';
import {
  getAvailabilityOverlap,
  findBestMeetingTime,
  calculateAvailabilityScore,
} from '@/lib/matching/availability';
import type { Availability } from '@/types/database';

function makeAvailability(overrides: Partial<Availability> = {}): Availability {
  const emptySlots = { morning: false, afternoon: false, evening: false, late_night: false };
  return {
    monday: { ...emptySlots },
    tuesday: { ...emptySlots },
    wednesday: { ...emptySlots },
    thursday: { ...emptySlots },
    friday: { ...emptySlots },
    saturday: { ...emptySlots },
    sunday: { ...emptySlots },
    ...overrides,
  };
}

describe('getAvailabilityOverlap', () => {
  it('returns empty array when no overlap exists', () => {
    const a = makeAvailability({
      monday: { morning: true, afternoon: false, evening: false, late_night: false },
    });
    const b = makeAvailability({
      monday: { morning: false, afternoon: true, evening: false, late_night: false },
    });

    const overlap = getAvailabilityOverlap(a, b);
    expect(overlap).toHaveLength(0);
  });

  it('finds overlap when both users are available at the same time', () => {
    const a = makeAvailability({
      monday: { morning: true, afternoon: true, evening: false, late_night: false },
    });
    const b = makeAvailability({
      monday: { morning: true, afternoon: false, evening: false, late_night: false },
    });

    const overlap = getAvailabilityOverlap(a, b);
    expect(overlap).toHaveLength(1);
    expect(overlap[0]).toEqual({ day: 'monday', slot: 'morning' });
  });

  it('finds multiple overlaps across different days', () => {
    const a = makeAvailability({
      monday: { morning: true, afternoon: true, evening: false, late_night: false },
      wednesday: { morning: false, afternoon: false, evening: true, late_night: false },
    });
    const b = makeAvailability({
      monday: { morning: true, afternoon: true, evening: false, late_night: false },
      wednesday: { morning: false, afternoon: false, evening: true, late_night: false },
    });

    const overlap = getAvailabilityOverlap(a, b);
    expect(overlap).toHaveLength(3);
  });

  it('handles full overlap (both always available)', () => {
    const fullSlots = { morning: true, afternoon: true, evening: true, late_night: true };
    const a: Availability = {
      monday: fullSlots,
      tuesday: fullSlots,
      wednesday: fullSlots,
      thursday: fullSlots,
      friday: fullSlots,
      saturday: fullSlots,
      sunday: fullSlots,
    };
    const b = { ...a };

    const overlap = getAvailabilityOverlap(a, b);
    expect(overlap).toHaveLength(28); // 7 days * 4 slots
  });
});

describe('findBestMeetingTime', () => {
  it('returns empty array when no overlap', () => {
    const a = makeAvailability({
      monday: { morning: true, afternoon: false, evening: false, late_night: false },
    });
    const b = makeAvailability({
      monday: { morning: false, afternoon: true, evening: false, late_night: false },
    });

    const result = findBestMeetingTime(a, b);
    expect(result).toHaveLength(0);
  });

  it('prefers weekday afternoon slots', () => {
    const slots = { morning: true, afternoon: true, evening: true, late_night: true };
    const a = makeAvailability({
      monday: slots,
      saturday: slots,
    });
    const b = makeAvailability({
      monday: slots,
      saturday: slots,
    });

    const result = findBestMeetingTime(a, b, 1);
    expect(result[0].day).toBe('monday');
    expect(result[0].slot).toBe('afternoon');
  });

  it('returns at most maxResults items', () => {
    const fullSlots = { morning: true, afternoon: true, evening: true, late_night: true };
    const a: Availability = {
      monday: fullSlots,
      tuesday: fullSlots,
      wednesday: fullSlots,
      thursday: fullSlots,
      friday: fullSlots,
      saturday: fullSlots,
      sunday: fullSlots,
    };
    const b = { ...a };

    const result = findBestMeetingTime(a, b, 3);
    expect(result).toHaveLength(3);
  });

  it('ranks weekday evenings above weekend mornings', () => {
    const a = makeAvailability({
      tuesday: { morning: false, afternoon: false, evening: true, late_night: false },
      sunday: { morning: true, afternoon: false, evening: false, late_night: false },
    });
    const b = makeAvailability({
      tuesday: { morning: false, afternoon: false, evening: true, late_night: false },
      sunday: { morning: true, afternoon: false, evening: false, late_night: false },
    });

    const result = findBestMeetingTime(a, b, 2);
    expect(result[0].day).toBe('tuesday');
    expect(result[0].slot).toBe('evening');
  });
});

describe('calculateAvailabilityScore', () => {
  it('returns 0 for no overlap', () => {
    const a = makeAvailability({
      monday: { morning: true, afternoon: false, evening: false, late_night: false },
    });
    const b = makeAvailability({
      monday: { morning: false, afternoon: true, evening: false, late_night: false },
    });

    expect(calculateAvailabilityScore(a, b)).toBe(0);
  });

  it('returns 5 for 1-2 overlapping slots', () => {
    const a = makeAvailability({
      monday: { morning: true, afternoon: true, evening: false, late_night: false },
    });
    const b = makeAvailability({
      monday: { morning: true, afternoon: false, evening: false, late_night: false },
    });

    expect(calculateAvailabilityScore(a, b)).toBe(5);
  });

  it('returns 15 for 7+ overlapping slots', () => {
    const slots = { morning: true, afternoon: true, evening: true, late_night: false };
    const a = makeAvailability({
      monday: slots,
      tuesday: slots,
      wednesday: slots,
    });
    const b = makeAvailability({
      monday: slots,
      tuesday: slots,
      wednesday: slots,
    });

    expect(calculateAvailabilityScore(a, b)).toBe(15);
  });
});
