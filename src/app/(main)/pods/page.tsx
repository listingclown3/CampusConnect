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
import { getUserCreatedPods } from '@/lib/data/crud-storage';
import { PodCard } from '@/components/pods/pod-card';
import { CreatePodDialog } from '@/components/pods/create-pod-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UsersRound, Layers, Search, X, Sparkles, BookOpen, Briefcase, Heart, CalendarDays } from 'lucide-react';
import type { PodType, Profile } from '@/types/database';
import { cn } from '@/lib/utils';

const FILTER_OPTIONS: { label: string; value: PodType | 'all' | 'my_pods'; icon?: React.ReactNode }[] = [
  { label: 'All Pods', value: 'all' },
  { label: 'My Pods', value: 'my_pods', icon: <Sparkles className="w-3 h-3" /> },
  { label: 'Study', value: 'study', icon: <BookOpen className="w-3 h-3" /> },
  { label: 'Project', value: 'project', icon: <Layers className="w-3 h-3" /> },
  { label: 'Career', value: 'career', icon: <Briefcase className="w-3 h-3" /> },
  { label: 'Interest', value: 'interest', icon: <Heart className="w-3 h-3" /> },
  { label: 'Event', value: 'event', icon: <CalendarDays className="w-3 h-3" /> },
];

export default function PodsPage() {
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<PodType | 'all' | 'my_pods'>('all');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const podsData = useMemo(() => {
    if (!user) return [];

    const mockPods = getPods();
    const userCreatedPods = getUserCreatedPods();
    const pods = [...mockPods, ...userCreatedPods];
    const students = getStudents();
    const userClassIds = getStudentClassIds(user.user_id);
    const userClasses = getClassesByIds(userClassIds);

    return pods.map((pod) => {
      const podMembers = getPodMembersForPod(pod.id);
      const memberProfiles: Profile[] = podMembers
        .map((pm) => students.find((s) => s.user_id === pm.user_id))
        .filter((p): p is Profile => p !== null && p !== undefined);

      const score = scorePodForUser(user, memberProfiles, pod);

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

      let meetingTime: { day: import('@/types/database').DayOfWeek; slot: import('@/types/database').TimeSlot }[] = [];
      if (memberProfiles.length > 0) {
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

    // Apply filter
    if (filter === 'my_pods') {
      sorted = sorted.filter((p) => p.isMember);
    } else if (filter !== 'all') {
      sorted = sorted.filter((p) => p.pod.pod_type === filter);
    }

    // Apply search
    if (search) {
      const q = search.toLowerCase();
      sorted = sorted.filter((p) =>
        p.pod.name.toLowerCase().includes(q) ||
        p.pod.description?.toLowerCase().includes(q) ||
        p.pod.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.memberProfiles.some(
          (m) => m.first_name.toLowerCase().includes(q) || m.last_name.toLowerCase().includes(q)
        )
      );
    }

    return sorted;
  }, [podsData, filter, search]);

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

  // Stats
  const myPodsCount = podsData.filter((p) => p.isMember).length;
  const totalPods = podsData.length;

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5 pb-24">
      {/* Header with context */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Study Pods</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Small groups matched by class, goals, and schedule.{' '}
            <span className="font-medium text-foreground">{myPodsCount}</span> joined,{' '}
            <span className="font-medium text-foreground">{totalPods}</span> available &mdash;
            ranked by how well they fit your profile.
          </p>
        </div>
        <CreatePodDialog onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pods by name, topic, tags, or member names..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border flex items-center gap-1.5',
              filter === opt.value
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            )}
          >
            {opt.icon}
            {opt.label}
            {opt.value === 'my_pods' && myPodsCount > 0 && (
              <span className={cn(
                'ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                filter === 'my_pods'
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-primary/10 text-primary'
              )}>
                {myPodsCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pods grid */}
      {filteredPods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Layers className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              {search ? 'No pods match your search' : 'No pods found'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search
                ? `No pods matching "${search}". Try different keywords or clear the search.`
                : filter === 'my_pods'
                ? 'You haven\'t joined any pods yet. Browse and join pods that match your interests!'
                : filter !== 'all'
                ? `No ${filter} pods available right now. Try a different filter or check back later.`
                : 'No recommended pods available right now. Check back later!'}
            </p>
          </div>
          {(search || filter !== 'all') && (
            <Button variant="outline" size="sm" onClick={() => { setSearch(''); setFilter('all'); }}>
              <UsersRound className="w-4 h-4 mr-1.5" />
              View All Pods
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
              tags={pod.tags}
              onJoin={() => handleJoin(pod.id)}
              onLeave={() => handleLeave(pod.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
