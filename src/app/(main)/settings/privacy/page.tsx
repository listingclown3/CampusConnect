'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth/context';
import { getBlockedUsers, unblockUser } from '@/lib/data/safety-actions';
import { toast } from 'sonner';

export default function PrivacySettingsPage() {
  const { user, updateProfile } = useAuth();
  const [isVisible, setIsVisible] = useState(user?.is_visible ?? true);
  const [hideFromMatching, setHideFromMatching] = useState(!user?.is_visible);
  const [availabilityDetail, setAvailabilityDetail] = useState<'full' | 'limited' | 'hidden'>('full');

  const blockedUsers = user ? getBlockedUsers(user.user_id) : [];

  const handleSave = () => {
    if (!user) return;

    updateProfile({
      ...user,
      is_visible: isVisible && !hideFromMatching,
      updated_at: new Date().toISOString(),
    });
    toast.success('Privacy settings updated!');
  };

  const handleUnblock = (blockedUserId: string) => {
    if (!user) return;
    unblockUser(user.user_id, blockedUserId);
    toast.success('User unblocked');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Visibility</CardTitle>
          <CardDescription>Control who can see your profile and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-lg border cursor-pointer min-h-[44px]">
            <div>
              <p className="text-sm font-medium">Show Profile</p>
              <p className="text-xs text-muted-foreground">Make your profile visible to other students</p>
            </div>
            <Checkbox
              checked={isVisible}
              onCheckedChange={(checked) => setIsVisible(checked as boolean)}
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border cursor-pointer min-h-[44px]">
            <div>
              <p className="text-sm font-medium">Hide from Matching</p>
              <p className="text-xs text-muted-foreground">Exclude your profile from match suggestions</p>
            </div>
            <Checkbox
              checked={hideFromMatching}
              onCheckedChange={(checked) => setHideFromMatching(checked as boolean)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
          <CardDescription>Control how much of your availability others can see</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Availability Detail Level</Label>
            <Select value={availabilityDetail} onValueChange={(v) => v && setAvailabilityDetail(v as 'full' | 'limited' | 'hidden')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full - Show all time slots</SelectItem>
                <SelectItem value="limited">Limited - Show day availability only</SelectItem>
                <SelectItem value="hidden">Hidden - Do not share availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {blockedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Blocked Users</CardTitle>
            <CardDescription>Users you have blocked will not see your profile or contact you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {blockedUsers.map((block) => (
              <div key={block.id} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm text-muted-foreground">User {block.blocked_user_id.slice(0, 8)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[36px]"
                  onClick={() => handleUnblock(block.blocked_user_id)}
                >
                  Unblock
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave} className="w-full h-11 min-h-[44px]">
        Save Privacy Settings
      </Button>
    </div>
  );
}
