'use client';

import { Clock, Calendar } from 'lucide-react';
import type { TimeSlot, DayOfWeek } from '@/types/database';

interface TimeSlotInfo {
  day: DayOfWeek;
  slot: TimeSlot;
}

interface PodMeetingTimeProps {
  meetingTimes: TimeSlotInfo[];
  compact?: boolean;
}

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

const slotLabels: Record<TimeSlot, string> = {
  morning: '9-12 AM',
  afternoon: '12-5 PM',
  evening: '5-9 PM',
  late_night: '9 PM+',
};

const slotShortLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  late_night: 'Night',
};

export function PodMeetingTime({ meetingTimes, compact = false }: PodMeetingTimeProps) {
  if (meetingTimes.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>No common time found</span>
      </div>
    );
  }

  if (compact) {
    const best = meetingTimes[0];
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{dayLabels[best.day]} {slotShortLabels[best.slot]}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Calendar className="w-4 h-4 text-primary" />
        <span>Suggested Meeting Times</span>
      </div>
      <div className="grid gap-2">
        {meetingTimes.map((time, idx) => (
          <div
            key={`${time.day}-${time.slot}`}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {idx + 1}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium capitalize">{dayLabels[time.day]}</span>
              <span className="text-muted-foreground">{slotLabels[time.slot]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
