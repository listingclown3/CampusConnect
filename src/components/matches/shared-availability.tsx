'use client';

import type { Availability, DayOfWeek, TimeSlot } from '@/types/database';
import { cn } from '@/lib/utils';

interface SharedAvailabilityProps {
  availabilityA: Availability;
  availabilityB: Availability;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const SLOTS: { key: TimeSlot; label: string }[] = [
  { key: 'morning', label: 'AM' },
  { key: 'afternoon', label: 'PM' },
  { key: 'evening', label: 'Eve' },
  { key: 'late_night', label: 'Late' },
];

export function SharedAvailability({ availabilityA, availabilityB }: SharedAvailabilityProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 text-[10px]">
        {/* Header row */}
        <div />
        {DAYS.map((day) => (
          <div key={day.key} className="text-center text-muted-foreground font-medium">
            {day.label}
          </div>
        ))}

        {/* Slot rows */}
        {SLOTS.map((slot) => (
          <>
            <div key={`label-${slot.key}`} className="text-muted-foreground font-medium flex items-center pr-1">
              {slot.label}
            </div>
            {DAYS.map((day) => {
              const bothAvailable = availabilityA[day.key]?.[slot.key] && availabilityB[day.key]?.[slot.key];
              const oneAvailable = availabilityA[day.key]?.[slot.key] || availabilityB[day.key]?.[slot.key];

              return (
                <div
                  key={`${day.key}-${slot.key}`}
                  className={cn(
                    'h-6 rounded-sm border',
                    bothAvailable
                      ? 'bg-green-200 border-green-300 dark:bg-green-900/40 dark:border-green-700'
                      : oneAvailable
                        ? 'bg-muted/50 border-border'
                        : 'bg-background border-border/50'
                  )}
                />
              );
            })}
          </>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-200 border border-green-300 dark:bg-green-900/40 dark:border-green-700" />
          Both free
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted/50 border border-border" />
          One free
        </span>
      </div>
    </div>
  );
}
