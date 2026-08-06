/**
 * Calendar Integration - Export to Google Calendar and Apple Calendar (.ics)
 * 
 * Supports generating:
 * - Google Calendar event URLs (opens in browser)
 * - Apple Calendar / iCal .ics file downloads
 * - Bulk export of multiple events
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  url?: string;
  recurrence?: string; // RRULE string for recurring events
}

// ============================================================
// Google Calendar URL Generation
// ============================================================

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams();

  params.set('action', 'TEMPLATE');
  params.set('text', event.title);
  params.set('details', event.description);
  params.set('location', event.location);

  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const startFormatted = formatDateForGoogle(event.startTime);
  const endFormatted = formatDateForGoogle(event.endTime);
  params.set('dates', `${startFormatted}/${endFormatted}`);

  if (event.url) {
    params.set('sprop', `website:${event.url}`);
  }

  if (event.recurrence) {
    params.set('recur', event.recurrence);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatDateForGoogle(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// ============================================================
// Apple Calendar / iCal .ics File Generation
// ============================================================

export function generateICSContent(events: CalendarEvent[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SpartanCircle//CampusConnect//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:SpartanCircle Events',
  ];

  for (const event of events) {
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}@spartancircle`;
    const now = formatDateForICS(new Date().toISOString());
    const start = formatDateForICS(event.startTime);
    const end = formatDateForICS(event.endTime);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
    lines.push(`SUMMARY:${escapeICSText(event.title)}`);
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
    lines.push(`LOCATION:${escapeICSText(event.location)}`);

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    if (event.recurrence) {
      lines.push(`RRULE:${event.recurrence}`);
    }

    // Add alarm/reminder 30 min before
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT30M');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Reminder: ${escapeICSText(event.title)}`);
    lines.push('END:VALARM');

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatDateForICS(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// ============================================================
// Download Helper
// ============================================================

export function downloadICSFile(events: CalendarEvent[], filename?: string): void {
  const content = generateICSContent(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'spartancircle-event.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================
// Convenience functions for different entity types
// ============================================================

export function exportEventToGoogle(event: {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}): void {
  const url = generateGoogleCalendarUrl({
    title: event.title,
    description: event.description,
    location: event.location,
    startTime: event.start_time,
    endTime: event.end_time,
  });
  window.open(url, '_blank');
}

export function exportEventToICS(event: {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}): void {
  downloadICSFile([{
    title: event.title,
    description: event.description,
    location: event.location,
    startTime: event.start_time,
    endTime: event.end_time,
  }], `${event.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.ics`);
}

export function exportPodMeetingToGoogle(pod: {
  name: string;
  description?: string | null;
  meetingDay?: string;
  meetingTime?: string;
}): void {
  // Create a meeting for next occurrence of the specified day
  const nextMeeting = getNextDayOccurrence(pod.meetingDay || 'monday');
  const startTime = new Date(nextMeeting);
  startTime.setHours(17, 0, 0, 0); // Default 5 PM
  const endTime = new Date(startTime);
  endTime.setHours(18, 0, 0, 0); // 1 hour meeting

  const url = generateGoogleCalendarUrl({
    title: `${pod.name} - Pod Meeting`,
    description: pod.description || `Study pod meeting for ${pod.name}`,
    location: 'TBD',
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    recurrence: 'FREQ=WEEKLY',
  });
  window.open(url, '_blank');
}

export function exportClubMeetingToGoogle(club: {
  name: string;
  description?: string;
  meeting_schedule?: string | null;
  location?: string | null;
}): void {
  const nextMeeting = new Date();
  nextMeeting.setDate(nextMeeting.getDate() + 7); // Next week
  nextMeeting.setHours(17, 0, 0, 0);
  const endTime = new Date(nextMeeting);
  endTime.setHours(18, 30, 0, 0);

  const url = generateGoogleCalendarUrl({
    title: `${club.name} Meeting`,
    description: `${club.description || club.name}\n\nSchedule: ${club.meeting_schedule || 'TBD'}`,
    location: club.location || 'TBD',
    startTime: nextMeeting.toISOString(),
    endTime: endTime.toISOString(),
    recurrence: 'FREQ=WEEKLY',
  });
  window.open(url, '_blank');
}

function getNextDayOccurrence(day: string): Date {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = days.indexOf(day.toLowerCase());
  const today = new Date();
  const currentDay = today.getDay();
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) daysUntil += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate;
}

// ============================================================
// Import helpers (parse .ics URL for Google/Apple)
// ============================================================

export function generateGoogleCalendarImportUrl(): string {
  return 'https://calendar.google.com/calendar/r/settings/export';
}

export function generateAppleCalendarSubscribeUrl(icsUrl: string): string {
  return `webcal://${icsUrl.replace(/^https?:\/\//, '')}`;
}
