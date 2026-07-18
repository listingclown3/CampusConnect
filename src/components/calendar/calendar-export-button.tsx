'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import {
  exportEventToGoogle,
  exportEventToICS,
  exportPodMeetingToGoogle,
  exportClubMeetingToGoogle,
  downloadICSFile,
} from '@/lib/calendar/export';
import { cn } from '@/lib/utils';

type ExportType = 'event' | 'pod' | 'club';

interface CalendarExportButtonProps {
  type: ExportType;
  data: {
    title?: string;
    name?: string;
    description?: string | null;
    location?: string | null;
    start_time?: string;
    end_time?: string;
    meeting_schedule?: string | null;
    meetingDay?: string;
  };
  compact?: boolean;
  className?: string;
}

export function CalendarExportButton({ type, data, compact = false, className }: CalendarExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleGoogleExport = () => {
    switch (type) {
      case 'event':
        exportEventToGoogle({
          title: data.title || data.name || 'Event',
          description: data.description || '',
          location: data.location || 'TBD',
          start_time: data.start_time || new Date().toISOString(),
          end_time: data.end_time || new Date(Date.now() + 7200000).toISOString(),
        });
        break;
      case 'pod':
        exportPodMeetingToGoogle({
          name: data.name || 'Pod Meeting',
          description: data.description,
          meetingDay: data.meetingDay,
        });
        break;
      case 'club':
        exportClubMeetingToGoogle({
          name: data.name || 'Club Meeting',
          description: data.description || undefined,
          meeting_schedule: data.meeting_schedule,
          location: data.location,
        });
        break;
    }
    setIsOpen(false);
  };

  const handleICSExport = () => {
    const startTime = data.start_time || new Date().toISOString();
    const endTime = data.end_time || new Date(Date.now() + 7200000).toISOString();

    downloadICSFile([{
      title: data.title || data.name || 'Event',
      description: data.description || '',
      location: data.location || 'TBD',
      startTime,
      endTime,
    }], `${(data.title || data.name || 'event').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.ics`);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-primary',
            className
          )}
          title="Add to calendar"
        >
          <Calendar className="w-4 h-4" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-150">
              <button
                onClick={handleGoogleExport}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                Google Calendar
              </button>
              <button
                onClick={handleICSExport}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                Apple Calendar (.ics)
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn('gap-1.5', className)}
      >
        <Calendar className="w-3.5 h-3.5" />
        Add to Calendar
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-56 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-150">
            <div className="p-2 space-y-0.5">
              <button
                onClick={handleGoogleExport}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-xs">Google Calendar</p>
                  <p className="text-[10px] text-muted-foreground">Opens in new tab</p>
                </div>
              </button>
              <button
                onClick={handleICSExport}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <Download className="w-3 h-3 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-xs">Apple Calendar</p>
                  <p className="text-[10px] text-muted-foreground">Download .ics file</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
