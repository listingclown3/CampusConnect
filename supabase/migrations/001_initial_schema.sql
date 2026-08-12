-- ============================================================
-- SpartanCircle Initial Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Enums
-- ============================================================

CREATE TYPE student_type AS ENUM ('freshman', 'transfer', 'continuing');
CREATE TYPE study_style AS ENUM ('solo', 'partner', 'group', 'flexible');
CREATE TYPE collaboration_style AS ENUM ('leader', 'contributor', 'independent', 'adaptive');
CREATE TYPE connection_type AS ENUM ('friends', 'study_buddies', 'project_partners', 'club_buddies', 'commute_buddies', 'career_networking');
CREATE TYPE pod_type AS ENUM ('study', 'project', 'career', 'interest', 'event', 'major_switch');
CREATE TYPE rsvp_status AS ENUM ('interested', 'going', 'not_going');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system', 'event');
CREATE TYPE conversation_type AS ENUM ('direct', 'pod', 'event', 'group');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
CREATE TYPE report_reason AS ENUM ('spam', 'harassment', 'inappropriate', 'fake_profile', 'other');
CREATE TYPE pod_member_role AS ENUM ('admin', 'member');
CREATE TYPE match_action_type AS ENUM ('like', 'pass', 'super_like');

-- ============================================================
-- Users (extends Supabase auth.users)
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- Profiles
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  student_type student_type NOT NULL DEFAULT 'freshman',
  major TEXT NOT NULL,
  intended_major TEXT,
  graduation_year INTEGER NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  career_goals TEXT[] NOT NULL DEFAULT '{}',
  study_style study_style NOT NULL DEFAULT 'flexible',
  collaboration_style collaboration_style NOT NULL DEFAULT 'adaptive',
  connection_types connection_type[] NOT NULL DEFAULT '{}',
  availability JSONB NOT NULL DEFAULT '{}',
  linkedin_url TEXT,
  instagram_handle TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_major ON profiles(major);
CREATE INDEX idx_profiles_is_visible ON profiles(is_visible);
CREATE INDEX idx_profiles_interests ON profiles USING GIN(interests);
CREATE INDEX idx_profiles_skills ON profiles USING GIN(skills);

-- ============================================================
-- Classes
-- ============================================================

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  department TEXT NOT NULL,
  section TEXT,
  semester TEXT NOT NULL,
  year INTEGER NOT NULL,
  instructor TEXT,
  schedule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_class UNIQUE (course_code, section, semester, year)
);

CREATE INDEX idx_classes_course_code ON classes(course_code);
CREATE INDEX idx_classes_department ON classes(department);

-- ============================================================
-- User Classes (enrollment)
-- ============================================================

CREATE TABLE user_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_class UNIQUE (user_id, class_id)
);

CREATE INDEX idx_user_classes_user_id ON user_classes(user_id);
CREATE INDEX idx_user_classes_class_id ON user_classes(class_id);

-- ============================================================
-- Matches
-- ============================================================

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  breakdown JSONB NOT NULL DEFAULT '{}',
  reasons TEXT[] NOT NULL DEFAULT '{}',
  status match_status NOT NULL DEFAULT 'pending',
  connection_type connection_type NOT NULL DEFAULT 'friends',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_match_pair UNIQUE (user_id, matched_user_id),
  CONSTRAINT no_self_match CHECK (user_id != matched_user_id)
);

CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_matched_user_id ON matches(matched_user_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_score ON matches(score DESC);

-- ============================================================
-- Match Actions
-- ============================================================

CREATE TABLE match_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action match_action_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_match_action UNIQUE (match_id, user_id)
);

CREATE INDEX idx_match_actions_match_id ON match_actions(match_id);
CREATE INDEX idx_match_actions_user_id ON match_actions(user_id);

-- ============================================================
-- Pods (Study Groups)
-- ============================================================

CREATE TABLE pods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  pod_type pod_type NOT NULL DEFAULT 'study',
  max_members INTEGER NOT NULL DEFAULT 5,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  score INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pods_pod_type ON pods(pod_type);
CREATE INDEX idx_pods_class_id ON pods(class_id);
CREATE INDEX idx_pods_created_by ON pods(created_by);
CREATE INDEX idx_pods_is_active ON pods(is_active);

-- ============================================================
-- Pod Members
-- ============================================================

CREATE TABLE pod_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role pod_member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_pod_member UNIQUE (pod_id, user_id)
);

CREATE INDEX idx_pod_members_pod_id ON pod_members(pod_id);
CREATE INDEX idx_pod_members_user_id ON pod_members(user_id);

-- ============================================================
-- Conversations
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type conversation_type NOT NULL DEFAULT 'direct',
  name TEXT,
  pod_id UUID REFERENCES pods(id) ON DELETE SET NULL,
  event_id UUID, -- will reference events table
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_pod_id ON conversations(pod_id);
CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ============================================================
-- Conversation Members
-- ============================================================

CREATE TABLE conversation_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT unique_conversation_member UNIQUE (conversation_id, user_id)
);

CREATE INDEX idx_conversation_members_conversation_id ON conversation_members(conversation_id);
CREATE INDEX idx_conversation_members_user_id ON conversation_members(user_id);

-- ============================================================
-- Messages
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type NOT NULL DEFAULT 'text',
  metadata JSONB,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================================
-- Clubs
-- ============================================================

CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meeting_schedule TEXT,
  location TEXT,
  website_url TEXT,
  instagram_handle TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clubs_category ON clubs(category);
CREATE INDEX idx_clubs_tags ON clubs USING GIN(tags);

-- ============================================================
-- Events
-- ============================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  location TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  max_attendees INTEGER,
  rsvp_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_virtual BOOLEAN NOT NULL DEFAULT false,
  virtual_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_events_club_id ON events(club_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_tags ON events USING GIN(tags);

-- Add foreign key for conversations.event_id now that events table exists
ALTER TABLE conversations ADD CONSTRAINT fk_conversations_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;

-- ============================================================
-- Event RSVPs
-- ============================================================

CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status rsvp_status NOT NULL DEFAULT 'interested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_event_rsvp UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user_id ON event_rsvps(user_id);

-- ============================================================
-- Reports
-- ============================================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason report_reason NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  CONSTRAINT no_self_report CHECK (reporter_id != reported_user_id)
);

CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================================
-- Blocks
-- ============================================================

CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_block UNIQUE (blocker_id, blocked_user_id),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_user_id)
);

CREATE INDEX idx_blocks_blocker_id ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked_user_id ON blocks(blocked_user_id);

-- ============================================================
-- Enable Row Level Security on all tables
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Updated at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pods_updated_at BEFORE UPDATE ON pods FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER event_rsvps_updated_at BEFORE UPDATE ON event_rsvps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
