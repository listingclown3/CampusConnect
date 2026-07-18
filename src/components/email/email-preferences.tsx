'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEmailPreferences, updateEmailPreferences, isEmailVerified } from '@/lib/email/service';
import type { EmailPreferences } from '@/lib/email/service';
import { toast } from 'sonner';
import { Bell, MessageCircle, Calendar, Users, Sparkles, Newspaper, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({ icon, label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg border transition-all',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/30',
      checked && !disabled ? 'border-primary/20 bg-primary/5' : 'border-border'
    )}>
      <div className="shrink-0 text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative w-10 h-5.5 rounded-full transition-colors shrink-0',
          checked ? 'bg-primary' : 'bg-muted-foreground/30',
          disabled && 'cursor-not-allowed'
        )}
        style={{ height: '22px' }}
      >
        <span
          className={cn(
            'absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[20px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function EmailPreferencesPanel() {
  const [prefs, setPrefs] = useState<EmailPreferences>(() => getEmailPreferences());
  const verified = isEmailVerified();

  const handleUpdate = (key: keyof EmailPreferences, value: boolean) => {
    const updated = updateEmailPreferences({ [key]: value });
    setPrefs(updated);
    toast.success('Preferences updated');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!verified && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Verify your email above to enable email notifications
            </p>
          </div>
        )}

        <ToggleRow
          icon={<Bell className="w-4 h-4" />}
          label="Email Notifications"
          description="Master toggle for all email notifications"
          checked={prefs.enabled}
          onChange={(v) => handleUpdate('enabled', v)}
          disabled={!verified}
        />

        <div className={cn('space-y-2 pl-2 border-l-2 border-border ml-4', !prefs.enabled && 'opacity-50')}>
          <ToggleRow
            icon={<MessageCircle className="w-4 h-4" />}
            label="Chat Messages"
            description="Get notified when someone sends you a message"
            checked={prefs.chatMessages}
            onChange={(v) => handleUpdate('chatMessages', v)}
            disabled={!verified || !prefs.enabled}
          />
          <ToggleRow
            icon={<Calendar className="w-4 h-4" />}
            label="Event Updates"
            description="Changes to events you're attending or interested in"
            checked={prefs.eventUpdates}
            onChange={(v) => handleUpdate('eventUpdates', v)}
            disabled={!verified || !prefs.enabled}
          />
          <ToggleRow
            icon={<Calendar className="w-4 h-4" />}
            label="Event Reminders"
            description="Reminder 1 hour before events you're attending"
            checked={prefs.eventReminders}
            onChange={(v) => handleUpdate('eventReminders', v)}
            disabled={!verified || !prefs.enabled}
          />
          <ToggleRow
            icon={<Users className="w-4 h-4" />}
            label="Pod Activity"
            description="When someone joins your pod or posts a message"
            checked={prefs.podActivity}
            onChange={(v) => handleUpdate('podActivity', v)}
            disabled={!verified || !prefs.enabled}
          />
          <ToggleRow
            icon={<Sparkles className="w-4 h-4" />}
            label="New Matches"
            description="When you get a new high-compatibility match"
            checked={prefs.newMatches}
            onChange={(v) => handleUpdate('newMatches', v)}
            disabled={!verified || !prefs.enabled}
          />
          <ToggleRow
            icon={<Newspaper className="w-4 h-4" />}
            label="Weekly Digest"
            description="Summary of activity, new events, and recommendations"
            checked={prefs.weeklyDigest}
            onChange={(v) => handleUpdate('weeklyDigest', v)}
            disabled={!verified || !prefs.enabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
