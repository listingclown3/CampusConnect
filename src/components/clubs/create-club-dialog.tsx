'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createClub } from '@/lib/data/crud-storage';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const CLUB_CATEGORIES = ['Technology', 'Business', 'Design', 'Health', 'Entertainment', 'Engineering', 'Art', 'Academic', 'Sports', 'Community'];

interface CreateClubDialogProps {
  onCreated?: () => void;
}

export function CreateClubDialog({ onCreated }: CreateClubDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [meetingSchedule, setMeetingSchedule] = useState('');
  const [location, setLocation] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a club name');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    createClub({
      name: name.trim(),
      description: description.trim(),
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      meeting_schedule: meetingSchedule.trim() || null,
      location: location.trim() || null,
      website_url: websiteUrl.trim() || null,
      instagram_handle: instagramHandle.trim() || null,
      member_count: 1,
      image_url: null,
      is_active: true,
    });

    toast.success(`Club "${name}" created successfully!`);
    setOpen(false);
    resetForm();
    onCreated?.();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('Technology');
    setMeetingSchedule('');
    setLocation('');
    setInstagramHandle('');
    setWebsiteUrl('');
    setTags('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
          <Plus className="w-4 h-4" />
          Create Club
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Club</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="club-name">Club Name *</Label>
            <Input
              id="club-name"
              placeholder="e.g., Blockchain Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="club-desc">Description *</Label>
            <Textarea
              id="club-desc"
              placeholder="What does this club do? Who should join?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLUB_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Meeting Schedule</Label>
              <Input
                placeholder="e.g., Mondays 5 PM"
                value={meetingSchedule}
                onChange={(e) => setMeetingSchedule(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="e.g., Engineering 285"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                placeholder="@handle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                placeholder="https://..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input
              placeholder="e.g., web3, crypto, DeFi, smart contracts"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Club
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
