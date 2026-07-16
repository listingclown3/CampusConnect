'use client';

import { cn } from '@/lib/utils';
import type { Availability, DayOfWeek, TimeSlot } from '@/types/database';

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

const TIME_SLOTS: { key: TimeSlot; label: string; short: string }[] = [
  { key: 'morning', label: 'Morning (8-12)', short: 'AM' },
  { key: 'afternoon', label: 'Afternoon (12-5)', short: 'PM' },
  { key: 'evening', label: 'Evening (5-9)', short: 'Eve' },
  { key: 'late_night', label: 'Late Night (9+)', short: 'Late' },
];

interface AvailabilityGridProps {
  value: Availability;
  onChange: (availability: Availability) => void;
  disabled?: boolean;
}

const DEFAULT_AVAILABILITY: Availability = {
  monday: { morning: false, afternoon: false, evening: false, late_night: false },
  tuesday: { morning: false, afternoon: false, evening: false, late_night: false },
  wednesday: { morning: false, afternoon: false, evening: false, late_night: false },
  thursday: { morning: false, afternoon: false, evening: false, late_night: false },
  friday: { morning: false, afternoon: false, evening: false, late_night: false },
  saturday: { morning: false, afternoon: false, evening: false, late_night: false },
  sunday: { morning: false, afternoon: false, evening: false, late_night: false },
};

export function AvailabilityGrid({ value, onChange, disabled = false }: AvailabilityGridProps) {
  const availability = value || DEFAULT_AVAILABILITY;

  const toggleSlot = (day: DayOfWeek, slot: TimeSlot) => {
    if (disabled) return;
    const updated = {
      ...availability,
      [day]: {
        ...availability[day],
        [slot]: !availability[day][slot],
      },
    };
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="grid grid-cols-[80px_repeat(4,1fr)] gap-1 text-xs text-muted-foreground font-medium">
        <div />
        {TIME_SLOTS.map((slot) => (
          <div key={slot.key} className="text-center py-1">
            <span className="hidden sm:inline">{slot.label}</span>
            <span className="sm:hidden">{slot.short}</span>
          </div>
        ))}
      </div>

      {/* Day rows */}
      {DAYS.map((day) => (
        <div key={day.key} className="grid grid-cols-[80px_repeat(4,1fr)] gap-1">
          <div className="flex items-center text-sm font-medium">
            <span className="hidden sm:inline">{day.label}</span>
            <span className="sm:hidden">{day.short}</span>
          </div>
          {TIME_SLOTS.map((slot) => {
            const isActive = availability[day.key]?.[slot.key] ?? false;
            return (
              <button
                key={`${day.key}-${slot.key}`}
                type="button"
                onClick={() => toggleSlot(day.key, slot.key)}
                disabled={disabled}
                className={cn(
                  'h-10 rounded-md border transition-all text-xs font-medium',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-muted/50 border-border hover:bg-muted hover:border-primary/30',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`${day.label} ${slot.label}: ${isActive ? 'available' : 'not available'}`}
              >
                {isActive && '✓'}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { DEFAULT_AVAILABILITY };
