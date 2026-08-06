'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import {
  getPodById,
  getStudents,
  getStudentClassIds,
  getClassesByIds,
} from '@/lib/mock-data';
import { findBestMeetingTime } from '@/lib/matching/availability';
import { generatePodExplanation } from '@/lib/ai';
import { scorePodForUser, getPodScoreBreakdown } from '@/lib/data/pod-scoring';
import {
  getPodMembersForPod,
  isUserInPod,
  joinPod,
  leavePod,
  getPodMemberCount,
  findPodConversation,
} from '@/lib/data/pod-actions';
import { PodTypeBadge } from '@/components/pods/pod-type-badge';
import { PodMembersList } from '@/components/pods/pod-members-list';
import { PodMeetingTime } from '@/components/pods/pod-meeting-time';
import { PodScoreBreakdown } from '@/components/pods/pod-score-breakdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Target,
  Check,
  LogOut,
  Layers,
} from 'lucide-react';
import type { Profile, DayOfWeek, TimeSlot } from '@/types/database';

interface TimeSlotInfo {
  day: DayOfWeek;
  slot: TimeSlot;
}

export default function PodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const podId = params.id as string;

  const [explanation, setExplanation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const pod = useMemo(() => getPodById(podId), [podId]);

  const podData = useMemo(() => {
    if (!pod || !user) return null;

    const students = getStudents();
    const podMembers = getPodMembersForPod(pod.id);
    const memberProfiles: Profile[] = podMembers
      .map((pm) => students.find((s) => s.user_id === pm.user_id))
      .filter((p): p is Profile => p !== null && p !== undefined);

    const userClassIds = getStudentClassIds(user.user_id);

    // Shared class info
    let sharedClassNames: string[] = [];
    if (pod.class_id) {
      const classes = getClassesByIds([pod.class_id]);
      if (classes.length > 0) {
        sharedClassNames = [classes[0].course_code];
      }
    }

    // Score
    const score = scorePodForUser(user, memberProfiles, pod);
    const breakdown = getPodScoreBreakdown(user, memberProfiles, pod);

    // Meeting times - combine availability overlap across all members
    let meetingTimes: TimeSlotInfo[] = [];
    if (memberProfiles.length > 0) {
      meetingTimes = findBestMeetingTime(user.availability, memberProfiles[0].availability, 3);
    }

    // Member contributions
    const memberInfos = memberProfiles.map((profile) => {
      const memberClassIds = getStudentClassIds(profile.user_id);
      const sharedClasses = userClassIds.filter((c) => memberClassIds.includes(c));
      const sharedClassesList = getClassesByIds(sharedClasses);

      let contribution: string | undefined;
      if (sharedClassesList.length > 0) {
        contribution = `shares ${sharedClassesList[0].course_code}`;
      } else {
        // Check availability
        const slots = findBestMeetingTime(user.availability, profile.availability, 1);
        if (slots.length > 0) {
          const slotLabel = slots[0].slot === 'evening' ? 'available evenings' :
            slots[0].slot === 'afternoon' ? 'available afternoons' :
            slots[0].slot === 'morning' ? 'available mornings' : 'available late night';
          contribution = slotLabel;
        }
      }

      return { profile, contribution };
    });

    const isMember = isUserInPod(pod.id, user.user_id);
    const memberCount = getPodMemberCount(pod.id);
    const isFull = memberCount >= pod.max_members;

    return {
      memberProfiles,
      memberInfos,
      sharedClassNames,
      score,
      breakdown,
      meetingTimes,
      isMember,
      isFull,
      memberCount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pod, user, refreshKey]);

  // Generate explanation
  useEffect(() => {
    if (!pod || !podData || !user) return;

    const currentMembers = podData.memberProfiles;
    const currentPodType = pod.pod_type;
    const currentSharedClassNames = podData.sharedClassNames;

    async function generate() {
      setIsGenerating(true);
      try {
        const exp = await generatePodExplanation(
          currentMembers,
          currentPodType,
          currentSharedClassNames
        );
        setExplanation(exp);
      } catch {
        setExplanation('This pod is a great match based on your profile and interests.');
      }
      setIsGenerating(false);
    }

    generate();
  }, [pod, podData, user]);

  const handleJoin = () => {
    if (!user || !pod) return;
    joinPod(pod.id, user.user_id);
    setRefreshKey((k) => k + 1);
  };

  const handleLeave = () => {
    if (!user || !pod) return;
    if (window.confirm('Are you sure you want to leave this pod? You will also be removed from the group chat.')) {
      leavePod(pod.id, user.user_id);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleOpenChat = () => {
    if (!pod) return;
    const conv = findPodConversation(pod.id);
    if (conv) {
      router.push(`/chat/${conv.id}`);
    } else {
      // Navigate to chat and let it figure out the conversation
      router.push('/chat');
    }
  };

  if (authLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // 404 state
  if (!pod) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Pod not found</h2>
            <p className="text-sm text-muted-foreground">
              This pod doesn&apos;t exist or has been deactivated.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/pods')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Pods
          </Button>
        </div>
      </div>
    );
  }

  if (!podData) return null;

  const { memberInfos, score, breakdown, meetingTimes, isMember, isFull, memberCount } = podData;

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 pb-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Pod header */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{pod.name}</h1>
            {pod.description && (
              <p className="text-sm text-muted-foreground mt-1">{pod.description}</p>
            )}
          </div>
          <PodTypeBadge type={pod.pod_type} className="text-xs" />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {memberCount}/{pod.max_members} members
          </span>
          {pod.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {pod.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compatibility score */}
      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 264} 264`}
                className={cn(
                  score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-orange-400'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{score}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Pod Compatibility
          </p>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why This Pod Works</CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
          )}
        </CardContent>
      </Card>

      {/* Score breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PodScoreBreakdown scores={breakdown} />
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members ({memberCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PodMembersList members={memberInfos} />
        </CardContent>
      </Card>

      {/* Meeting time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Best Meeting Times</CardTitle>
        </CardHeader>
        <CardContent>
          <PodMeetingTime meetingTimes={meetingTimes} />
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-background/95 backdrop-blur py-3 px-4 -mx-4 border-t">
        {isMember ? (
          <>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleOpenChat}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open Group Chat
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLeave}
              title="Leave pod"
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : isFull ? (
          <Button variant="secondary" className="flex-1" disabled>
            <Users className="w-4 h-4 mr-2" />
            Pod Full ({memberCount}/{pod.max_members})
          </Button>
        ) : (
          <Button
            variant="default"
            className="flex-1"
            onClick={handleJoin}
          >
            <Check className="w-4 h-4 mr-2" />
            Join Pod
          </Button>
        )}
      </div>
    </div>
  );
}
