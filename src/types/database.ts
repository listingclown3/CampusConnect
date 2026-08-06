// ============================================================
// SpartanCircle Database Types
// ============================================================

// Enums
export type StudentType = 'freshman' | 'transfer' | 'continuing';
export type StudyStyle = 'solo' | 'partner' | 'group' | 'flexible';
export type CollaborationStyle = 'leader' | 'contributor' | 'independent' | 'adaptive';
export type ConnectionType = 'friends' | 'study_buddies' | 'project_partners' | 'club_buddies' | 'commute_buddies' | 'career_networking';
export type PodType = 'study' | 'project' | 'career' | 'interest' | 'event' | 'major_switch';
export type RsvpStatus = 'interested' | 'going' | 'not_going';
export type MessageType = 'text' | 'image' | 'system' | 'event';
export type ConversationType = 'direct' | 'pod' | 'event' | 'group';
export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'fake_profile' | 'other';

// Availability model: Mon-Sun with time slots
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'late_night';

export type Availability = {
  [key in DayOfWeek]: {
    [slot in TimeSlot]: boolean;
  };
};

// ============================================================
// Core Tables
// ============================================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_sign_in: string | null;
  is_active: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  student_type: StudentType;
  major: string;
  intended_major: string | null;
  graduation_year: number;
  interests: string[];
  skills: string[];
  career_goals: string[];
  study_style: StudyStyle;
  collaboration_style: CollaborationStyle;
  connection_types: ConnectionType[];
  availability: Availability;
  linkedin_url: string | null;
  instagram_handle: string | null;
  is_visible: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  course_code: string;
  course_name: string;
  department: string;
  section: string | null;
  semester: string;
  year: number;
  instructor: string | null;
  schedule: string | null;
  created_at: string;
}

export interface UserClass {
  id: string;
  user_id: string;
  class_id: string;
  created_at: string;
}

// ============================================================
// Matching
// ============================================================

export interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
  status: MatchStatus;
  connection_type: ConnectionType;
  created_at: string;
  updated_at: string;
}

export interface MatchBreakdown {
  shared_classes: number;
  same_or_related_major: number;
  availability_overlap: number;
  shared_interests: number;
  career_goal_similarity: number;
  complementary_skills: number;
}

export interface MatchAction {
  id: string;
  match_id: string;
  user_id: string;
  action: 'like' | 'pass' | 'super_like';
  created_at: string;
}

// ============================================================
// Pods (Study Groups)
// ============================================================

export interface Pod {
  id: string;
  name: string;
  description: string | null;
  pod_type: PodType;
  max_members: number;
  class_id: string | null;
  created_by: string;
  is_active: boolean;
  score: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface PodMember {
  id: string;
  pod_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

// ============================================================
// Conversations & Messages
// ============================================================

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string | null;
  pod_id: string | null;
  event_id: string | null;
  created_by: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  is_muted: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  metadata: Record<string, unknown> | null;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Clubs & Events
// ============================================================

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  meeting_schedule: string | null;
  location: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  member_count: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  club_id: string | null;
  organizer_id: string | null;
  location: string;
  start_time: string;
  end_time: string;
  tags: string[];
  category: string;
  max_attendees: number | null;
  rsvp_count: number;
  image_url: string | null;
  is_virtual: boolean;
  virtual_link: string | null;
  created_at: string;
}

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Safety
// ============================================================

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_user_id: string;
  created_at: string;
}

// ============================================================
// Utility Types
// ============================================================

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
}

export interface PodSuggestion {
  members: Profile[];
  score: number;
  pod_type: PodType;
  name: string;
  description: string;
  reasons: string[];
}

export interface EventRecommendation {
  event: Event;
  score: number;
  reasons: string[];
}
