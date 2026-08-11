import type {
  StudentType,
  StudyStyle,
  CollaborationStyle,
  ConnectionType,
  Availability,
} from '@/types/database';

export type SpartanStep =
  | 'landing'
  | 'basic'
  | 'academics'
  | 'interests'
  | 'skills'
  | 'availability'
  | 'privacy';

export interface SelectedCourse {
  id: string;
  code: string;
  title: string;
}

export interface ClassMeeting {
  id: string;
  courseCode: string;
  courseTitle: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface SpartanOnboardingState {
  // Basics
  firstName: string;
  lastName: string;
  studentType: StudentType;
  graduationYear: number;
  avatarDataUrl: string | null;

  // Academics
  major: string;
  plannedMajor: string;
  selectedClasses: SelectedCourse[];

  // Interests
  selectedInterests: string[];
  customInterests: string[];
  careerGoals: string;
  studyStyle: StudyStyle;
  collaborationStyle: CollaborationStyle;

  // Skills
  selectedSkills: string[];
  customSkills: string[];
  selectedConnections: ConnectionType[];

  // Availability
  classMeetings: ClassMeeting[];

  // Privacy
  profileVisible: boolean;
  showEmail: boolean;
  availabilityDetail: 'full' | 'limited' | 'hidden';
  instagramHandle: string;
  linkedinUrl: string;
}

export const DEFAULT_SPARTAN_STATE: SpartanOnboardingState = {
  firstName: '',
  lastName: '',
  studentType: 'freshman',
  graduationYear: 2028,
  avatarDataUrl: null,
  major: '',
  plannedMajor: '',
  selectedClasses: [],
  selectedInterests: [],
  customInterests: [],
  careerGoals: '',
  studyStyle: 'flexible',
  collaborationStyle: 'adaptive',
  selectedSkills: [],
  customSkills: [],
  selectedConnections: [],
  classMeetings: [],
  profileVisible: true,
  showEmail: false,
  availabilityDetail: 'full',
  instagramHandle: '',
  linkedinUrl: '',
};

/** SpartanCircle's study-style options don't line up with the app's DB enum
 * ('solo' | 'partner' | 'group' | 'flexible') — closest-fit mapping. */
export const STUDY_STYLE_MAP: Record<string, StudyStyle> = {
  quiet: 'solo',
  music: 'solo',
  group: 'group',
  visual: 'flexible',
  practice: 'flexible',
  mixed: 'flexible',
};

/** Same story for collaboration style vs the DB enum
 * ('leader' | 'contributor' | 'independent' | 'adaptive'). */
export const COLLABORATION_STYLE_MAP: Record<string, CollaborationStyle> = {
  leader: 'leader',
  supporter: 'contributor',
  brainstormer: 'contributor',
  planner: 'leader',
  independent: 'independent',
  flexible: 'adaptive',
};

export const CONNECTION_LABEL_MAP: Record<string, ConnectionType> = {
  'Friends 🤝': 'friends',
  'Club Buddies 👥': 'club_buddies',
  'Study Buddy 📚': 'study_buddies',
  'Project Partners 💻': 'project_partners',
  'Commute Buddies 🚗': 'commute_buddies',
  'Networking 💼': 'career_networking',
};

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'late_night'] as const;

/** Class meetings only tell us when someone is BUSY (in class), on weekdays
 * only. Derive a full Mon–Sun availability grid: any weekday slot touched by
 * a class meeting is marked unavailable, everything else (including the
 * weekend, which SpartanCircle's UI never asks about) defaults available. */
export function deriveAvailability(meetings: ClassMeeting[]): Availability {
  const slotHours: Record<(typeof TIME_SLOTS)[number], [number, number]> = {
    morning: [6, 12],
    afternoon: [12, 17],
    evening: [17, 21],
    late_night: [21, 24],
  };

  const availability = {} as Availability;
  for (const day of DAY_KEYS) {
    availability[day] = {
      morning: true,
      afternoon: true,
      evening: true,
      late_night: true,
    };
  }

  for (const meeting of meetings) {
    const dayKey = meeting.day.toLowerCase() as (typeof DAY_KEYS)[number];
    if (!availability[dayKey]) continue;
    const [startH] = meeting.startTime.split(':').map(Number);
    const [endH, endM] = meeting.endTime.split(':').map(Number);
    const endHour = endM > 0 ? endH + 1 : endH;

    for (const slot of TIME_SLOTS) {
      const [slotStart, slotEnd] = slotHours[slot];
      if (startH < slotEnd && endHour > slotStart) {
        availability[dayKey][slot] = false;
      }
    }
  }

  return availability;
}
