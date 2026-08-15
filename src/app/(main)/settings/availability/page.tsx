'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AvailabilityGrid, DEFAULT_AVAILABILITY } from '@/components/onboarding/availability-grid';
import { useAuth } from '@/lib/auth/context';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AvailabilitySettingsPage() {
  const { user, updateProfile } = useAuth();
  const [availability, setAvailability] = useState(user?.availability || DEFAULT_AVAILABILITY);

  const handleSave = async () => {
    if (!user) return;

    const result = await updateProfile({
      ...user,
      availability,
      updated_at: new Date().toISOString(),
    });
    if (!result.success) {
      toast.error(result.error || 'Could not save your availability. Please try again.');
      return;
    }
    toast.success('Availability updated!');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Availability</CardTitle>
          <CardDescription>Tap cells to toggle when you are free to connect</CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityGrid value={availability} onChange={setAvailability} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calendar Sync</CardTitle>
          <CardDescription>Import your schedule to auto-fill availability</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full gap-2" type="button">
            <Calendar className="w-4 h-4" />
            Import from Calendar
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Calendar sync coming soon. Set your availability manually for now.
          </p>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full h-11">
        Save Availability
      </Button>
    </div>
  );
}
