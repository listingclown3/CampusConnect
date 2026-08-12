import type { Profile } from '@/types/database';

export const mockStudents: Profile[] = [
  {
    "id": "user-001",
    "first_name": "Aisha",
    "last_name": "Patel",
    "major": "Computer Science",
    "student_type": "freshman",
    "interests": [
      "AI",
      "machine learning",
      "robotics",
      "hackathons"
    ],
    "skills": [
      "Python",
      "TensorFlow",
      "data analysis"
    ],
    "career_goals": [
      "AI researcher",
      "machine learning engineer"
    ],
    "study_style": "group",
    "collaboration_style": "leader",
    "connection_types": [
      "study_buddies",
      "project_partners",
      "career_networking"
    ],
    "user_id": "user-001",
    "display_name": "Aisha P.",
    "avatar_url": null,
    "bio": "Hey! I am Aisha, a freshman Computer Science student at SJSU. Looking to connect with others who share my interests in AI and machine learning.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@aishapatel",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-002",
    "first_name": "Marcus",
    "last_name": "Chen",
    "major": "Computer Science",
    "student_type": "transfer",
    "interests": [
      "web development",
      "open source",
      "gaming",
      "music"
    ],
    "skills": [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript"
    ],
    "career_goals": [
      "full-stack developer",
      "startup founder"
    ],
    "study_style": "partner",
    "collaboration_style": "contributor",
    "connection_types": [
      "study_buddies",
      "project_partners",
      "friends"
    ],
    "user_id": "user-002",
    "display_name": "Marcus C.",
    "avatar_url": null,
    "bio": "Hey! I am Marcus, a transfer Computer Science student at SJSU. Looking to connect with others who share my interests in web development and open source.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@marcuschen",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-003",
    "first_name": "Sofia",
    "last_name": "Rodriguez",
    "major": "Software Engineering",
    "student_type": "freshman",
    "interests": [
      "UX design",
      "mobile apps",
      "photography",
      "hiking"
    ],
    "skills": [
      "Figma",
      "Swift",
      "UI design",
      "user research"
    ],
    "career_goals": [
      "UX engineer",
      "product designer"
    ],
    "study_style": "partner",
    "collaboration_style": "adaptive",
    "connection_types": [
      "project_partners",
      "friends",
      "career_networking"
    ],
    "user_id": "user-003",
    "display_name": "Sofia R.",
    "avatar_url": null,
    "bio": "Hey! I am Sofia, a freshman Software Engineering student at SJSU. Looking to connect with others who share my interests in UX design and mobile apps.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@sofiarodriguez",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-004",
    "first_name": "Jordan",
    "last_name": "Williams",
    "major": "Business Administration",
    "student_type": "freshman",
    "interests": [
      "entrepreneurship",
      "marketing",
      "basketball",
      "podcasts"
    ],
    "skills": [
      "public speaking",
      "market research",
      "Excel",
      "leadership"
    ],
    "career_goals": [
      "startup founder",
      "product manager"
    ],
    "study_style": "group",
    "collaboration_style": "leader",
    "connection_types": [
      "career_networking",
      "friends",
      "club_buddies"
    ],
    "user_id": "user-004",
    "display_name": "Jordan W.",
    "avatar_url": null,
    "bio": "Hey! I am Jordan, a freshman Business Administration student at SJSU. Looking to connect with others who share my interests in entrepreneurship and marketing.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@jordanwilliams",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-005",
    "first_name": "Priya",
    "last_name": "Sharma",
    "major": "Data Science",
    "student_type": "transfer",
    "interests": [
      "statistics",
      "machine learning",
      "cooking",
      "dance"
    ],
    "skills": [
      "R",
      "Python",
      "SQL",
      "Tableau"
    ],
    "career_goals": [
      "data scientist",
      "analytics lead"
    ],
    "study_style": "solo",
    "collaboration_style": "independent",
    "connection_types": [
      "study_buddies",
      "career_networking"
    ],
    "user_id": "user-005",
    "display_name": "Priya S.",
    "avatar_url": null,
    "bio": "Hey! I am Priya, a transfer Data Science student at SJSU. Looking to connect with others who share my interests in statistics and machine learning.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@priyasharma",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-006",
    "first_name": "Tyler",
    "last_name": "Nguyen",
    "major": "Computer Engineering",
    "student_type": "freshman",
    "interests": [
      "embedded systems",
      "IoT",
      "drones",
      "3D printing"
    ],
    "skills": [
      "C++",
      "Arduino",
      "circuit design",
      "MATLAB"
    ],
    "career_goals": [
      "hardware engineer",
      "IoT developer"
    ],
    "study_style": "partner",
    "collaboration_style": "contributor",
    "connection_types": [
      "study_buddies",
      "project_partners"
    ],
    "user_id": "user-006",
    "display_name": "Tyler N.",
    "avatar_url": null,
    "bio": "Hey! I am Tyler, a freshman Computer Engineering student at SJSU. Looking to connect with others who share my interests in embedded systems and IoT.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@tylernguyen",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-007",
    "first_name": "Emma",
    "last_name": "Thompson",
    "major": "Psychology",
    "student_type": "freshman",
    "interests": [
      "cognitive science",
      "mental health",
      "yoga",
      "reading"
    ],
    "skills": [
      "research methods",
      "SPSS",
      "writing",
      "counseling"
    ],
    "career_goals": [
      "clinical psychologist",
      "UX researcher"
    ],
    "study_style": "solo",
    "collaboration_style": "independent",
    "connection_types": [
      "study_buddies",
      "friends"
    ],
    "user_id": "user-007",
    "display_name": "Emma T.",
    "avatar_url": null,
    "bio": "Hey! I am Emma, a freshman Psychology student at SJSU. Looking to connect with others who share my interests in cognitive science and mental health.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@emmathompson",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-008",
    "first_name": "David",
    "last_name": "Kim",
    "major": "Computer Science",
    "student_type": "freshman",
    "interests": [
      "cybersecurity",
      "CTF competitions",
      "chess",
      "anime"
    ],
    "skills": [
      "Linux",
      "networking",
      "Python",
      "penetration testing"
    ],
    "career_goals": [
      "security engineer",
      "ethical hacker"
    ],
    "study_style": "solo",
    "collaboration_style": "independent",
    "connection_types": [
      "study_buddies",
      "project_partners"
    ],
    "user_id": "user-008",
    "display_name": "David K.",
    "avatar_url": null,
    "bio": "Hey! I am David, a freshman Computer Science student at SJSU. Looking to connect with others who share my interests in cybersecurity and CTF competitions.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@davidkim",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-009",
    "first_name": "Maya",
    "last_name": "Johnson",
    "major": "Biology",
    "student_type": "freshman",
    "interests": [
      "pre-med",
      "genetics",
      "volunteering",
      "running"
    ],
    "skills": [
      "lab techniques",
      "biology",
      "chemistry",
      "first aid"
    ],
    "career_goals": [
      "physician",
      "medical researcher"
    ],
    "study_style": "group",
    "collaboration_style": "adaptive",
    "connection_types": [
      "study_buddies",
      "friends",
      "career_networking"
    ],
    "user_id": "user-009",
    "display_name": "Maya J.",
    "avatar_url": null,
    "bio": "Hey! I am Maya, a freshman Biology student at SJSU. Looking to connect with others who share my interests in pre-med and genetics.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@mayajohnson",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-010",
    "first_name": "Alex",
    "last_name": "Martinez",
    "major": "Computer Science",
    "student_type": "transfer",
    "interests": [
      "game development",
      "VR/AR",
      "animation",
      "storytelling"
    ],
    "skills": [
      "Unity",
      "C#",
      "Blender",
      "3D modeling"
    ],
    "career_goals": [
      "game developer",
      "VR engineer"
    ],
    "study_style": "group",
    "collaboration_style": "contributor",
    "connection_types": [
      "project_partners",
      "friends",
      "club_buddies"
    ],
    "user_id": "user-010",
    "display_name": "Alex M.",
    "avatar_url": null,
    "bio": "Hey! I am Alex, a transfer Computer Science student at SJSU. Looking to connect with others who share my interests in game development and VR/AR.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@alexmartinez",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-011",
    "first_name": "Rachel",
    "last_name": "Lee",
    "major": "Communications",
    "student_type": "freshman",
    "interests": [
      "social media",
      "journalism",
      "film",
      "travel"
    ],
    "skills": [
      "video editing",
      "content creation",
      "writing",
      "Adobe Suite"
    ],
    "career_goals": [
      "content strategist",
      "social media manager"
    ],
    "study_style": "flexible",
    "collaboration_style": "adaptive",
    "connection_types": [
      "friends",
      "club_buddies",
      "career_networking"
    ],
    "user_id": "user-011",
    "display_name": "Rachel L.",
    "avatar_url": null,
    "bio": "Hey! I am Rachel, a freshman Communications student at SJSU. Looking to connect with others who share my interests in social media and journalism.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@rachellee",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-012",
    "first_name": "Kevin",
    "last_name": "Zhang",
    "major": "Electrical Engineering",
    "student_type": "freshman",
    "interests": [
      "renewable energy",
      "Tesla",
      "circuits",
      "hiking"
    ],
    "skills": [
      "MATLAB",
      "circuit analysis",
      "Simulink",
      "C"
    ],
    "career_goals": [
      "power systems engineer",
      "renewable energy specialist"
    ],
    "study_style": "partner",
    "collaboration_style": "contributor",
    "connection_types": [
      "study_buddies",
      "project_partners"
    ],
    "user_id": "user-012",
    "display_name": "Kevin Z.",
    "avatar_url": null,
    "bio": "Hey! I am Kevin, a freshman Electrical Engineering student at SJSU. Looking to connect with others who share my interests in renewable energy and Tesla.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@kevinzhang",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-013",
    "first_name": "Jasmine",
    "last_name": "Brown",
    "major": "Business Administration",
    "student_type": "transfer",
    "interests": [
      "finance",
      "investing",
      "real estate",
      "networking"
    ],
    "skills": [
      "financial modeling",
      "Excel",
      "accounting",
      "analytics"
    ],
    "career_goals": [
      "investment banker",
      "financial analyst"
    ],
    "study_style": "solo",
    "collaboration_style": "leader",
    "connection_types": [
      "career_networking",
      "study_buddies"
    ],
    "user_id": "user-013",
    "display_name": "Jasmine B.",
    "avatar_url": null,
    "bio": "Hey! I am Jasmine, a transfer Business Administration student at SJSU. Looking to connect with others who share my interests in finance and investing.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@jasminebrown",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-014",
    "first_name": "Ryan",
    "last_name": "O'Connor",
    "major": "Computer Science",
    "student_type": "freshman",
    "interests": [
      "blockchain",
      "crypto",
      "startups",
      "economics"
    ],
    "skills": [
      "Solidity",
      "JavaScript",
      "smart contracts",
      "Node.js"
    ],
    "career_goals": [
      "blockchain developer",
      "Web3 entrepreneur"
    ],
    "study_style": "flexible",
    "collaboration_style": "leader",
    "connection_types": [
      "project_partners",
      "career_networking",
      "friends"
    ],
    "user_id": "user-014",
    "display_name": "Ryan O.",
    "avatar_url": null,
    "bio": "Hey! I am Ryan, a freshman Computer Science student at SJSU. Looking to connect with others who share my interests in blockchain and crypto.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@ryano'connor",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-015",
    "first_name": "Lily",
    "last_name": "Wang",
    "major": "Graphic Design",
    "student_type": "freshman",
    "interests": [
      "illustration",
      "typography",
      "branding",
      "anime"
    ],
    "skills": [
      "Illustrator",
      "Photoshop",
      "InDesign",
      "sketching"
    ],
    "career_goals": [
      "brand designer",
      "creative director"
    ],
    "study_style": "solo",
    "collaboration_style": "independent",
    "connection_types": [
      "friends",
      "club_buddies",
      "project_partners"
    ],
    "user_id": "user-015",
    "display_name": "Lily W.",
    "avatar_url": null,
    "bio": "Hey! I am Lily, a freshman Graphic Design student at SJSU. Looking to connect with others who share my interests in illustration and typography.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@lilywang",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-016",
    "first_name": "Daniel",
    "last_name": "Garcia",
    "major": "Mechanical Engineering",
    "student_type": "freshman",
    "interests": [
      "automotive",
      "formula SAE",
      "CAD",
      "soccer"
    ],
    "skills": [
      "SolidWorks",
      "AutoCAD",
      "FEA",
      "manufacturing"
    ],
    "career_goals": [
      "automotive engineer",
      "mechanical design engineer"
    ],
    "study_style": "group",
    "collaboration_style": "contributor",
    "connection_types": [
      "study_buddies",
      "project_partners",
      "club_buddies"
    ],
    "user_id": "user-016",
    "display_name": "Daniel G.",
    "avatar_url": null,
    "bio": "Hey! I am Daniel, a freshman Mechanical Engineering student at SJSU. Looking to connect with others who share my interests in automotive and formula SAE.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@danielgarcia",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-017",
    "first_name": "Samantha",
    "last_name": "Park",
    "major": "Computer Science",
    "student_type": "freshman",
    "interests": [
      "cloud computing",
      "DevOps",
      "coffee",
      "board games"
    ],
    "skills": [
      "AWS",
      "Docker",
      "Kubernetes",
      "Python"
    ],
    "career_goals": [
      "cloud architect",
      "DevOps engineer"
    ],
    "study_style": "partner",
    "collaboration_style": "adaptive",
    "connection_types": [
      "study_buddies",
      "project_partners",
      "career_networking"
    ],
    "user_id": "user-017",
    "display_name": "Samantha P.",
    "avatar_url": null,
    "bio": "Hey! I am Samantha, a freshman Computer Science student at SJSU. Looking to connect with others who share my interests in cloud computing and DevOps.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@samanthapark",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-018",
    "first_name": "Chris",
    "last_name": "Taylor",
    "major": "Kinesiology",
    "student_type": "transfer",
    "interests": [
      "sports medicine",
      "nutrition",
      "weight training",
      "surfing"
    ],
    "skills": [
      "anatomy",
      "first aid",
      "personal training",
      "coaching"
    ],
    "career_goals": [
      "physical therapist",
      "sports scientist"
    ],
    "study_style": "group",
    "collaboration_style": "adaptive",
    "connection_types": [
      "study_buddies",
      "friends",
      "commute_buddies"
    ],
    "user_id": "user-018",
    "display_name": "Chris T.",
    "avatar_url": null,
    "bio": "Hey! I am Chris, a transfer Kinesiology student at SJSU. Looking to connect with others who share my interests in sports medicine and nutrition.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@christaylor",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-019",
    "first_name": "Natalie",
    "last_name": "Foster",
    "major": "English",
    "student_type": "freshman",
    "interests": [
      "creative writing",
      "poetry",
      "book club",
      "theater"
    ],
    "skills": [
      "writing",
      "editing",
      "public speaking",
      "research"
    ],
    "career_goals": [
      "author",
      "editor",
      "content writer"
    ],
    "study_style": "solo",
    "collaboration_style": "independent",
    "connection_types": [
      "friends",
      "club_buddies"
    ],
    "user_id": "user-019",
    "display_name": "Natalie F.",
    "avatar_url": null,
    "bio": "Hey! I am Natalie, a freshman English student at SJSU. Looking to connect with others who share my interests in creative writing and poetry.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@nataliefoster",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-020",
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "major": "Computer Science",
    "student_type": "freshman",
    "interests": [
      "mobile development",
      "UI/UX",
      "photography",
      "calligraphy"
    ],
    "skills": [
      "Flutter",
      "Dart",
      "Firebase",
      "Figma"
    ],
    "career_goals": [
      "mobile developer",
      "app entrepreneur"
    ],
    "study_style": "partner",
    "collaboration_style": "contributor",
    "connection_types": [
      "project_partners",
      "study_buddies",
      "friends"
    ],
    "user_id": "user-020",
    "display_name": "Ahmed H.",
    "avatar_url": null,
    "bio": "Hey! I am Ahmed, a freshman Computer Science student at SJSU. Looking to connect with others who share my interests in mobile development and UI/UX.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@ahmedhassan",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-021",
    "first_name": "Isabella",
    "last_name": "Moreno",
    "major": "Environmental Science",
    "student_type": "freshman",
    "interests": [
      "sustainability",
      "climate change",
      "gardening",
      "camping"
    ],
    "skills": [
      "GIS",
      "data collection",
      "research",
      "Python"
    ],
    "career_goals": [
      "environmental consultant",
      "sustainability analyst"
    ],
    "study_style": "group",
    "collaboration_style": "adaptive",
    "connection_types": [
      "study_buddies",
      "career_networking",
      "club_buddies"
    ],
    "user_id": "user-021",
    "display_name": "Isabella M.",
    "avatar_url": null,
    "bio": "Hey! I am Isabella, a freshman Environmental Science student at SJSU. Looking to connect with others who share my interests in sustainability and climate change.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@isabellamoreno",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-022",
    "first_name": "Jason",
    "last_name": "Liu",
    "major": "Data Science",
    "student_type": "freshman",
    "interests": [
      "NLP",
      "computer vision",
      "kaggle",
      "basketball"
    ],
    "skills": [
      "Python",
      "PyTorch",
      "pandas",
      "SQL"
    ],
    "career_goals": [
      "ML engineer",
      "data scientist at FAANG"
    ],
    "study_style": "partner",
    "collaboration_style": "contributor",
    "connection_types": [
      "study_buddies",
      "project_partners",
      "career_networking"
    ],
    "user_id": "user-022",
    "display_name": "Jason L.",
    "avatar_url": null,
    "bio": "Hey! I am Jason, a freshman Data Science student at SJSU. Looking to connect with others who share my interests in NLP and computer vision.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@jasonliu",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-023",
    "first_name": "Olivia",
    "last_name": "Adams",
    "major": "Marketing",
    "student_type": "transfer",
    "interests": [
      "digital marketing",
      "SEO",
      "branding",
      "fashion"
    ],
    "skills": [
      "Google Analytics",
      "social media",
      "copywriting",
      "Canva"
    ],
    "career_goals": [
      "marketing manager",
      "brand strategist"
    ],
    "study_style": "flexible",
    "collaboration_style": "leader",
    "connection_types": [
      "career_networking",
      "friends",
      "club_buddies"
    ],
    "user_id": "user-023",
    "display_name": "Olivia A.",
    "avatar_url": null,
    "bio": "Hey! I am Olivia, a transfer Marketing student at SJSU. Looking to connect with others who share my interests in digital marketing and SEO.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@oliviaadams",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "wednesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-024",
    "first_name": "Nathan",
    "last_name": "Wright",
    "major": "Computer Science",
    "student_type": "freshman",
    "interests": [
      "systems programming",
      "compilers",
      "math",
      "piano"
    ],
    "skills": [
      "Rust",
      "C",
      "assembly",
      "algorithms"
    ],
    "career_goals": [
      "systems engineer",
      "compiler developer"
    ],
    "study_style": "solo",
    "collaboration_style": "independent",
    "connection_types": [
      "study_buddies",
      "project_partners"
    ],
    "user_id": "user-024",
    "display_name": "Nathan W.",
    "avatar_url": null,
    "bio": "Hey! I am Nathan, a freshman Computer Science student at SJSU. Looking to connect with others who share my interests in systems programming and compilers.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@nathanwright",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "tuesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "thursday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "friday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "saturday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "sunday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  },
  {
    "id": "user-025",
    "first_name": "Zara",
    "last_name": "Singh",
    "major": "Biomedical Engineering",
    "student_type": "freshman",
    "interests": [
      "medical devices",
      "prosthetics",
      "volunteering",
      "tennis"
    ],
    "skills": [
      "MATLAB",
      "CAD",
      "biology",
      "signal processing"
    ],
    "career_goals": [
      "biomedical engineer",
      "medical device designer"
    ],
    "study_style": "partner",
    "collaboration_style": "adaptive",
    "connection_types": [
      "study_buddies",
      "project_partners",
      "career_networking"
    ],
    "user_id": "user-025",
    "display_name": "Zara S.",
    "avatar_url": null,
    "bio": "Hey! I am Zara, a freshman Biomedical Engineering student at SJSU. Looking to connect with others who share my interests in medical devices and prosthetics.",
    "intended_major": null,
    "graduation_year": 2028,
    "linkedin_url": null,
    "instagram_handle": "@zarasingh",
    "is_visible": true,
    "onboarding_complete": true,
    "availability": {
      "monday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "tuesday": {
        "morning": true,
        "afternoon": true,
        "evening": true,
        "late_night": true
      },
      "wednesday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "thursday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "friday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      },
      "saturday": {
        "morning": false,
        "afternoon": true,
        "evening": false,
        "late_night": false
      },
      "sunday": {
        "morning": true,
        "afternoon": false,
        "evening": true,
        "late_night": true
      }
    },
    "created_at": "2024-08-01T00:00:00Z",
    "updated_at": "2024-08-15T00:00:00Z"
  }
];

/** Mapping of user_id to their enrolled class IDs */
export const studentClassMap: Record<string, string[]> = {
  "user-001": [
    "cls-001",
    "cls-002",
    "cls-003"
  ],
  "user-002": [
    "cls-001",
    "cls-002",
    "cls-004"
  ],
  "user-003": [
    "cls-001",
    "cls-009",
    "cls-004"
  ],
  "user-004": [
    "cls-005",
    "cls-004",
    "cls-008"
  ],
  "user-005": [
    "cls-001",
    "cls-003",
    "cls-010"
  ],
  "user-006": [
    "cls-001",
    "cls-009",
    "cls-003"
  ],
  "user-007": [
    "cls-007",
    "cls-004",
    "cls-011"
  ],
  "user-008": [
    "cls-001",
    "cls-002",
    "cls-012"
  ],
  "user-009": [
    "cls-006",
    "cls-004",
    "cls-013"
  ],
  "user-010": [
    "cls-001",
    "cls-002",
    "cls-014"
  ],
  "user-011": [
    "cls-008",
    "cls-004",
    "cls-015"
  ],
  "user-012": [
    "cls-003",
    "cls-009",
    "cls-010"
  ],
  "user-013": [
    "cls-005",
    "cls-003",
    "cls-008"
  ],
  "user-014": [
    "cls-001",
    "cls-002",
    "cls-005"
  ],
  "user-015": [
    "cls-004",
    "cls-015",
    "cls-011"
  ],
  "user-016": [
    "cls-009",
    "cls-003",
    "cls-010"
  ],
  "user-017": [
    "cls-001",
    "cls-002",
    "cls-012"
  ],
  "user-018": [
    "cls-006",
    "cls-007",
    "cls-013"
  ],
  "user-019": [
    "cls-004",
    "cls-008",
    "cls-011"
  ],
  "user-020": [
    "cls-001",
    "cls-002",
    "cls-009"
  ],
  "user-021": [
    "cls-006",
    "cls-003",
    "cls-010"
  ],
  "user-022": [
    "cls-001",
    "cls-003",
    "cls-010"
  ],
  "user-023": [
    "cls-005",
    "cls-008",
    "cls-015"
  ],
  "user-024": [
    "cls-001",
    "cls-002",
    "cls-003"
  ],
  "user-025": [
    "cls-006",
    "cls-009",
    "cls-003"
  ]
};
