'use client';

import { useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import {
  getPods,
  getStudents,
  getStudentClassIds,
  getClassesByIds,
} from '@/lib/mock-data';
import { findBestMeetingTime } from '@/lib/matching/availability';
import { scorePodForUser } from '@/lib/data/pod-scoring';
import {
  getPodMembersForPod,
  isUserInPod,
  joinPod,
  leavePod,
  getPodMemberCount,
} from '@/lib/data/pod-actions';
import { PodCard } from '@/components/pods/pod-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UsersRound, Layers } from 'lucide-react';
import type { PodType, Profile } from '@/types/database';
import { cn } from '@/lib/utils';

const FILTER_OPTIONS: { label: string; value: PodType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Study', value: 'study' },
  { label: 'Project', value: 'project' },
  { label: 'Career', value: 'career' },
  { label: 'Interest', value: 'interest' },
];

export default function PodsPage() {
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<PodType | 'all'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const podsData = useMemo(() => {
    if (!user) return [];

    const pods = getPods();
    const students = getStudents();
    const userClassIds = getStudentClassIds(user.user_id);
    const userClasses = getClassesByIds(userClassIds);

    return pods.map((pod) => {
      const podMembers = getPodMembersForPod(pod.id);
      const memberProfiles: Profile[] = podMembers
        .map((pm) => students.find((s) => s.user_id === pm.user_id))
        .filter((p): p is Profile => p !== null && p !== undefined);

      // Calculate score for current user against this pod
      const score = scorePodForUser(user, memberProfiles, pod);

      // Find shared class/goal
      let sharedGoal: string | undefined;
      if (pod.class_id) {
        const cls = userClasses.find((c) => c.id === pod.class_id);
        if (cls) {
          sharedGoal = `Shared: ${cls.course_code}`;
        } else {
          const allClasses = getClassesByIds([pod.class_id]);
          if (allClasses.length > 0) {
            sharedGoal = `Class: ${allClasses[0].course_code}`;
          }
        }
      }
      if (!sharedGoal && pod.tags.length > 0) {
        const matchingTags = pod.tags.filter((t) =>
          user.interests.some((i) => i.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(i.toLowerCase()))
        );
        if (matchingTags.length > 0) {
          sharedGoal = `Shared interest: ${matchingTags[0]}`;
        } else {
          sharedGoal = pod.tags[0];
        }
      }

      // Find best meeting time
      let meetingTime: { day: import('@/types/database').DayOfWeek; slot: import('@/types/database').TimeSlot }[] = [];
      if (memberProfiles.length > 0) {
        // Find overlapping time between user and first member as representative
        meetingTime = findBestMeetingTime(user.availability, memberProfiles[0].availability, 2);
      }

      const isMember = isUserInPod(pod.id, user.user_id);
      const memberCount = getPodMemberCount(pod.id);
      const isFull = memberCount >= pod.max_members;

      return {
        pod,
        memberProfiles,
        score,
        sharedGoal,
        meetingTime,
        isMember,
        isFull,
        memberCount,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]);

  const filteredPods = useMemo(() => {
    let sorted = [...podsData].sort((a, b) => b.score - a.score);
    if (filter !== 'all') {
      sorted = sorted.filter((p) => p.pod.pod_type === filter);
    }
    return sorted;
  }, [podsData, filter]);

  const handleJoin = useCallback(
    (podId: string) => {
      if (!user) return;
      joinPod(podId, user.user_id);
      setRefreshKey((k) => k + 1);
    },
    [user]
  );

  const handleLeave = useCallback(
    (podId: string) => {
      if (!user) return;
      if (window.confirm('Are you sure you want to leave this pod?')) {
        leavePod(podId, user.user_id);
        setRefreshKey((k) => k + 1);
      }
    },
    [user]
  );

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Pods</h1>
        <p className="text-sm text-muted-foreground">
          Recommended study groups sorted by compatibility
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors border',
              filter === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Pods list */}
      {filteredPods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Layers className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">No pods found</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              {filter !== 'all'
                ? `No ${filter} pods available right now. Try a different filter.`
                : 'No recommended pods available right now. Check back later!'}
            </p>
          </div>
          {filter !== 'all' && (
            <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
              <UsersRound className="w-4 h-4 mr-1.5" />
              View All Pods
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPods.map(({ pod, memberProfiles, score, sharedGoal, meetingTime, isMember, isFull }) => (
            <PodCard
              key={pod.id}
              podId={pod.id}
              name={pod.name}
              podType={pod.pod_type}
              description={pod.description}
              members={memberProfiles}
              maxMembers={pod.max_members}
              score={score}
              sharedGoal={sharedGoal}
              meetingTime={meetingTime}
              isMember={isMember}
              isFull={isFull}
              onJoin={() => handleJoin(pod.id)}
              onLeave={() => handleLeave(pod.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
