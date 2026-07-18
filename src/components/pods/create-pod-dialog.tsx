'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/context';
import { createPod } from '@/lib/data/crud-storage';
import { joinPod } from '@/lib/data/pod-actions';
import type { PodType } from '@/types/database';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface CreatePodDialogProps {
  onCreated?: () => void;
}

export function CreatePodDialog({ onCreated }: CreatePodDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [podType, setPodType] = useState<PodType>('study');
  const [maxMembers, setMaxMembers] = useState(5);
  const [tags, setTags] = useState('');

  const handleCreate = () => {
    if (!user) return;
    if (!name.trim()) {
      toast.error('Please enter a pod name');
      return;
    }

    const newPod = createPod({
      name: name.trim(),
      description: description.trim() || null,
      pod_type: podType,
      max_members: maxMembers,
      class_id: null,
      created_by: user.user_id,
      is_active: true,
      score: 75,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    // Auto-join the creator
    joinPod(newPod.id, user.user_id);

    toast.success(`Pod "${name}" created! You've been added as a member.`);
    setOpen(false);
    resetForm();
    onCreated?.();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPodType('study');
    setMaxMembers(5);
    setTags('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
          <Plus className="w-4 h-4" />
          Create Pod
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Pod</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="pod-name">Pod Name *</Label>
            <Input
              id="pod-name"
              placeholder="e.g., CS 146 Study Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pod-desc">Description</Label>
            <Textarea
              id="pod-desc"
              placeholder="What is this pod about? What will you work on together?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={podType} onValueChange={(v) => v && setPodType(v as PodType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Members</Label>
              <Select value={String(maxMembers)} onValueChange={(v) => setMaxMembers(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 8, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} people</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pod-tags">Tags (comma separated)</Label>
            <Input
              id="pod-tags"
              placeholder="e.g., java, algorithms, midterm prep"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Pod
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
