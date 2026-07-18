'use client';

import { EmailVerification } from '@/components/email/email-verification';
import { EmailPreferencesPanel } from '@/components/email/email-preferences';

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Notification Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how and when you want to be notified about activity on SpartanCircle.
        </p>
      </div>

      <EmailVerification />
      <EmailPreferencesPanel />
    </div>
  );
}
