'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth/context';
import {
  getSocialLinks,
  addSocialLink,
  removeSocialLink,
  toggleLinkVisibility,
} from '@/lib/data/social-links';
import { SOCIAL_PLATFORMS, getPlatformConfig } from '@/types/social-links';
import type { SocialLink, SocialPlatform } from '@/types/social-links';
import { toast } from 'sonner';
import {
  Plus, Trash2, Eye, EyeOff, Globe, Link as LinkIcon,
  Heart, Users, AtSign, Video,
  Phone, Mail, MessageSquare, Send, Music, Hash, Tv,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Map platform icon strings to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Instagram: Heart, Facebook: Users, Github: AtSign, Twitter: AtSign, Linkedin: Users, Youtube: Video,
  Phone, Mail, MessageSquare, Send, Music, Hash, Tv, Video,
  Smartphone, Globe, Link: LinkIcon,
  Ghost: MessageSquare, // fallback for Snapchat
};

function PlatformIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const config = getPlatformConfig(platform);
  const Icon = ICON_MAP[config.icon] || LinkIcon;
  return <Icon className={className} />;
}

export function SocialLinksManager() {
  const { user } = useAuth();
  const [links, setLinks] = useState<SocialLink[]>(() =>
    user ? getSocialLinks(user.user_id) : []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('instagram');
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(true);

  const refreshLinks = useCallback(() => {
    if (user) setLinks(getSocialLinks(user.user_id));
  }, [user]);

  const handleAdd = () => {
    if (!user || !newValue.trim()) {
      toast.error('Please enter a value');
      return;
    }

    addSocialLink(user.user_id, {
      platform: newPlatform,
      value: newValue.trim(),
      label: newPlatform === 'other' ? newLabel.trim() : undefined,
      isPublic: newIsPublic,
    });

    setNewValue('');
    setNewLabel('');
    setNewPlatform('instagram');
    setNewIsPublic(true);
    setIsAdding(false);
    refreshLinks();
    toast.success('Social link added!');
  };

  const handleRemove = (linkId: string) => {
    if (!user) return;
    removeSocialLink(user.user_id, linkId);
    refreshLinks();
    toast.success('Link removed');
  };

  const handleToggleVisibility = (linkId: string) => {
    if (!user) return;
    toggleLinkVisibility(user.user_id, linkId);
    refreshLinks();
  };

  const platformConfig = getPlatformConfig(newPlatform);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Social Links</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Add your social media, contact info, and links. Choose which are public on your profile.
          </p>
        </div>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add new link form */}
        {isAdding && (
          <div className="p-4 border rounded-lg bg-muted/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Platform</Label>
                <Select value={newPlatform} onValueChange={(v) => setNewPlatform(v as SocialPlatform)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((p) => (
                      <SelectItem key={p.platform} value={p.platform}>
                        <span className="flex items-center gap-2">
                          <PlatformIcon platform={p.platform} className="w-3.5 h-3.5" />
                          {p.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">
                  {platformConfig.name === 'Other' ? 'URL / Handle' : platformConfig.placeholder}
                </Label>
                <Input
                  className="h-9"
                  placeholder={platformConfig.placeholder}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>
            </div>

            {newPlatform === 'other' && (
              <div className="space-y-1.5">
                <Label className="text-xs">Custom Label</Label>
                <Input
                  className="h-9"
                  placeholder="e.g., Portfolio, Blog, Behance..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setNewIsPublic(!newIsPublic)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all',
                  newIsPublic
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900'
                    : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800'
                )}
              >
                {newIsPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {newIsPublic ? 'Public' : 'Private'}
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAdd}>
                  Add Link
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Existing links */}
        {links.length === 0 && !isAdding ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <LinkIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No social links added yet</p>
            <p className="text-xs text-muted-foreground">
              Add your socials so others can connect with you outside the app
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => {
              const config = getPlatformConfig(link.platform);
              return (
                <div
                  key={link.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm',
                    config.bgColor
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: config.color + '15' }}
                  >
                    <PlatformIcon
                      platform={link.platform}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {link.label || config.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleVisibility(link.id)}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        link.isPublic
                          ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-950'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                      title={link.isPublic ? 'Visible on profile' : 'Hidden from profile'}
                    >
                      {link.isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleRemove(link.id)}
                      className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
