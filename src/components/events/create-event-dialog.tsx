'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/context';
import { createEvent } from '@/lib/data/crud-storage';
import { notifyEventUpdate } from '@/lib/notifications/store';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const EVENT_CATEGORIES = ['Social', 'Workshop', 'Competition', 'Career', 'Academic', 'Showcase', 'Panel', 'Info Session'];

interface CreateEventDialogProps {
  onCreated?: () => void;
}

export function CreateEventDialog({ onCreated }: CreateEventDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Social');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [tags, setTags] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [virtualLink, setVirtualLink] = useState('');

  const handleCreate = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    if (!location.trim() && !isVirtual) {
      toast.error('Please enter a location');
      return;
    }
    if (!startDate || !startTime) {
      toast.error('Please set a start date and time');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}:00`).toISOString();
    const endDateTime = endDate && endTime
      ? new Date(`${endDate}T${endTime}:00`).toISOString()
      : new Date(new Date(startDateTime).getTime() + 2 * 60 * 60 * 1000).toISOString();

    await createEvent({
      title: title.trim(),
      description: description.trim() || `Join us for ${title.trim()}!`,
      club_id: null,
      organizer_id: user.user_id,
      location: isVirtual ? 'Online' : location.trim(),
      start_time: startDateTime,
      end_time: endDateTime,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      category,
      max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
      rsvp_count: 0,
      image_url: null,
      is_virtual: isVirtual,
      virtual_link: isVirtual ? virtualLink.trim() || null : null,
    });

    // Notify about the new event
    notifyEventUpdate(title.trim(), '', 'A new event has been created. Check it out!');

    toast.success(`Event "${title}" created successfully!`);
    setOpen(false);
    resetForm();
    onCreated?.();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Social');
    setLocation('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setMaxAttendees('');
    setTags('');
    setIsVirtual(false);
    setVirtualLink('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
          <Plus className="w-4 h-4" />
          Create Event
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="evt-title">Event Title *</Label>
            <Input
              id="evt-title"
              placeholder="e.g., Machine Learning Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evt-desc">Description</Label>
            <Textarea
              id="evt-desc"
              placeholder="Describe the event, what to expect, what to bring..."
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
                  {EVENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Attendees</Label>
              <Input
                type="number"
                placeholder="Unlimited"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
              />
            </div>
          </div>

          {/* Virtual toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVirtual}
                onChange={(e) => setIsVirtual(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">This is a virtual event</span>
            </label>
          </div>

          {isVirtual ? (
            <div className="space-y-2">
              <Label>Meeting Link</Label>
              <Input
                placeholder="https://zoom.us/j/..."
                value={virtualLink}
                onChange={(e) => setVirtualLink(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                placeholder="e.g., Engineering Building 189"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          {/* Date/time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (!endDate) setEndDate(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input
              placeholder="e.g., coding, workshop, free food"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
