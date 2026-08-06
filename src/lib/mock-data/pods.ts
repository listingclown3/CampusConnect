import type { Pod, PodMember } from '@/types/database';

export const mockPods: Pod[] = [
  {
    "id": "pod-001",
    "name": "CS 46A Study Squad",
    "description": "Group study sessions for CS 46A. We meet twice a week to work through assignments and prep for exams.",
    "pod_type": "study",
    "max_members": 5,
    "class_id": "cls-001",
    "created_by": "user-001",
    "is_active": true,
    "score": 85,
    "tags": [
      "CS 46A",
      "programming",
      "Java",
      "study group"
    ],
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T00:00:00Z"
  },
  {
    "id": "pod-002",
    "name": "AI Project Team",
    "description": "Building an AI-powered study recommendation system for our senior project.",
    "pod_type": "project",
    "max_members": 4,
    "class_id": null,
    "created_by": "user-001",
    "is_active": true,
    "score": 90,
    "tags": [
      "AI",
      "machine learning",
      "project",
      "Python"
    ],
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T00:00:00Z"
  },
  {
    "id": "pod-003",
    "name": "Pre-Med Study Circle",
    "description": "Supporting each other through the pre-med journey. Weekly study sessions and MCAT prep.",
    "pod_type": "study",
    "max_members": 5,
    "class_id": "cls-006",
    "created_by": "user-009",
    "is_active": true,
    "score": 78,
    "tags": [
      "pre-med",
      "biology",
      "chemistry",
      "MCAT"
    ],
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T00:00:00Z"
  },
  {
    "id": "pod-004",
    "name": "Startup Founders Pod",
    "description": "Weekly check-ins for students building startups. Share progress, get feedback, stay accountable.",
    "pod_type": "career",
    "max_members": 5,
    "class_id": null,
    "created_by": "user-004",
    "is_active": true,
    "score": 82,
    "tags": [
      "startups",
      "entrepreneurship",
      "accountability",
      "business"
    ],
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T00:00:00Z"
  },
  {
    "id": "pod-005",
    "name": "Engineering Design Team",
    "description": "Collaborative engineering design challenges and portfolio building.",
    "pod_type": "project",
    "max_members": 4,
    "class_id": "cls-009",
    "created_by": "user-006",
    "is_active": true,
    "score": 75,
    "tags": [
      "engineering",
      "design",
      "CAD",
      "teamwork"
    ],
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T00:00:00Z"
  }
];

export const mockPodMembers: PodMember[] = [
  {
    "id": "pm-pod-001-user-001",
    "pod_id": "pod-001",
    "user_id": "user-001",
    "role": "admin",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-001-user-002",
    "pod_id": "pod-001",
    "user_id": "user-002",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-001-user-008",
    "pod_id": "pod-001",
    "user_id": "user-008",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-001-user-017",
    "pod_id": "pod-001",
    "user_id": "user-017",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-002-user-001",
    "pod_id": "pod-002",
    "user_id": "user-001",
    "role": "admin",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-002-user-005",
    "pod_id": "pod-002",
    "user_id": "user-005",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-002-user-022",
    "pod_id": "pod-002",
    "user_id": "user-022",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-003-user-009",
    "pod_id": "pod-003",
    "user_id": "user-009",
    "role": "admin",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-003-user-018",
    "pod_id": "pod-003",
    "user_id": "user-018",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-003-user-025",
    "pod_id": "pod-003",
    "user_id": "user-025",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-004-user-004",
    "pod_id": "pod-004",
    "user_id": "user-004",
    "role": "admin",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-004-user-014",
    "pod_id": "pod-004",
    "user_id": "user-014",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-004-user-023",
    "pod_id": "pod-004",
    "user_id": "user-023",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-004-user-013",
    "pod_id": "pod-004",
    "user_id": "user-013",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-005-user-006",
    "pod_id": "pod-005",
    "user_id": "user-006",
    "role": "admin",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-005-user-012",
    "pod_id": "pod-005",
    "user_id": "user-012",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-005-user-016",
    "pod_id": "pod-005",
    "user_id": "user-016",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  },
  {
    "id": "pm-pod-005-user-025",
    "pod_id": "pod-005",
    "user_id": "user-025",
    "role": "member",
    "joined_at": "2024-08-20T00:00:00Z"
  }
];
