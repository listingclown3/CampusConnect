import type { Conversation, ConversationMember, Message } from '@/types/database';

export const mockConversations: Conversation[] = [
  {
    "id": "conv-001",
    "type": "direct",
    "name": null,
    "pod_id": null,
    "event_id": null,
    "created_by": "user-001",
    "last_message_at": "2024-08-25T14:30:00Z",
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T14:30:00Z"
  },
  {
    "id": "conv-002",
    "type": "direct",
    "name": null,
    "pod_id": null,
    "event_id": null,
    "created_by": "user-002",
    "last_message_at": "2024-08-25T16:45:00Z",
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T16:45:00Z"
  },
  {
    "id": "conv-003",
    "type": "pod",
    "name": "CS 46A Study Squad",
    "pod_id": "pod-001",
    "event_id": null,
    "created_by": "user-001",
    "last_message_at": "2024-08-25T20:00:00Z",
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T20:00:00Z"
  },
  {
    "id": "conv-004",
    "type": "direct",
    "name": null,
    "pod_id": null,
    "event_id": null,
    "created_by": "user-004",
    "last_message_at": "2024-08-24T11:00:00Z",
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-24T11:00:00Z"
  },
  {
    "id": "conv-005",
    "type": "pod",
    "name": "AI Project Team",
    "pod_id": "pod-002",
    "event_id": null,
    "created_by": "user-001",
    "last_message_at": "2024-08-25T18:15:00Z",
    "created_at": "2024-08-20T00:00:00Z",
    "updated_at": "2024-08-25T18:15:00Z"
  }
];

export const mockConversationMembers: ConversationMember[] = [
  {
    "id": "cm-001",
    "conversation_id": "conv-001",
    "user_id": "user-001",
    "joined_at": "2024-08-20T10:00:00Z",
    "last_read_at": "2024-08-25T14:30:00Z",
    "is_muted": false
  },
  {
    "id": "cm-002",
    "conversation_id": "conv-001",
    "user_id": "user-002",
    "joined_at": "2024-08-20T10:00:00Z",
    "last_read_at": "2024-08-25T14:25:00Z",
    "is_muted": false
  },
  {
    "id": "cm-003",
    "conversation_id": "conv-002",
    "user_id": "user-002",
    "joined_at": "2024-08-21T09:00:00Z",
    "last_read_at": "2024-08-25T16:45:00Z",
    "is_muted": false
  },
  {
    "id": "cm-004",
    "conversation_id": "conv-002",
    "user_id": "user-003",
    "joined_at": "2024-08-21T09:00:00Z",
    "last_read_at": "2024-08-25T16:40:00Z",
    "is_muted": false
  },
  {
    "id": "cm-005",
    "conversation_id": "conv-003",
    "user_id": "user-001",
    "joined_at": "2024-08-20T12:00:00Z",
    "last_read_at": "2024-08-25T20:00:00Z",
    "is_muted": false
  },
  {
    "id": "cm-006",
    "conversation_id": "conv-003",
    "user_id": "user-002",
    "joined_at": "2024-08-20T12:00:00Z",
    "last_read_at": "2024-08-25T19:55:00Z",
    "is_muted": false
  },
  {
    "id": "cm-007",
    "conversation_id": "conv-003",
    "user_id": "user-008",
    "joined_at": "2024-08-20T12:00:00Z",
    "last_read_at": "2024-08-25T19:50:00Z",
    "is_muted": false
  },
  {
    "id": "cm-008",
    "conversation_id": "conv-003",
    "user_id": "user-017",
    "joined_at": "2024-08-20T12:00:00Z",
    "last_read_at": "2024-08-25T19:45:00Z",
    "is_muted": false
  },
  {
    "id": "cm-009",
    "conversation_id": "conv-004",
    "user_id": "user-004",
    "joined_at": "2024-08-22T14:00:00Z",
    "last_read_at": "2024-08-24T11:00:00Z",
    "is_muted": false
  },
  {
    "id": "cm-010",
    "conversation_id": "conv-004",
    "user_id": "user-013",
    "joined_at": "2024-08-22T14:00:00Z",
    "last_read_at": "2024-08-24T10:55:00Z",
    "is_muted": false
  },
  {
    "id": "cm-011",
    "conversation_id": "conv-005",
    "user_id": "user-001",
    "joined_at": "2024-08-20T15:00:00Z",
    "last_read_at": "2024-08-25T18:15:00Z",
    "is_muted": false
  },
  {
    "id": "cm-012",
    "conversation_id": "conv-005",
    "user_id": "user-005",
    "joined_at": "2024-08-20T15:00:00Z",
    "last_read_at": "2024-08-25T18:10:00Z",
    "is_muted": false
  },
  {
    "id": "cm-013",
    "conversation_id": "conv-005",
    "user_id": "user-022",
    "joined_at": "2024-08-20T15:00:00Z",
    "last_read_at": "2024-08-25T18:05:00Z",
    "is_muted": false
  }
];

export const mockMessages: Message[] = [
  {
    "id": "msg-001",
    "conversation_id": "conv-001",
    "sender_id": "user-001",
    "content": "Hey Marcus! I saw we are both in CS 46A. Want to study together sometime?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T10:05:00Z",
    "updated_at": "2024-08-20T10:05:00Z"
  },
  {
    "id": "msg-002",
    "conversation_id": "conv-001",
    "sender_id": "user-002",
    "content": "Hey Aisha! Yeah totally, I was looking for a study partner. When are you usually free?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T10:15:00Z",
    "updated_at": "2024-08-20T10:15:00Z"
  },
  {
    "id": "msg-003",
    "conversation_id": "conv-001",
    "sender_id": "user-001",
    "content": "I am usually free Tuesday and Thursday afternoons. We could meet at the library?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T10:20:00Z",
    "updated_at": "2024-08-20T10:20:00Z"
  },
  {
    "id": "msg-004",
    "conversation_id": "conv-001",
    "sender_id": "user-002",
    "content": "Perfect! Thursday afternoons work great for me. King Library 4th floor?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T10:25:00Z",
    "updated_at": "2024-08-20T10:25:00Z"
  },
  {
    "id": "msg-005",
    "conversation_id": "conv-001",
    "sender_id": "user-001",
    "content": "Sounds good! I also started working on the first assignment already if you want to compare approaches.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T11:00:00Z",
    "updated_at": "2024-08-20T11:00:00Z"
  },
  {
    "id": "msg-006",
    "conversation_id": "conv-001",
    "sender_id": "user-002",
    "content": "Yes please! I got stuck on problem 3. Would love to talk it through.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T11:10:00Z",
    "updated_at": "2024-08-20T11:10:00Z"
  },
  {
    "id": "msg-007",
    "conversation_id": "conv-001",
    "sender_id": "user-001",
    "content": "Same here lol. See you Thursday then!",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T14:30:00Z",
    "updated_at": "2024-08-25T14:30:00Z"
  },
  {
    "id": "msg-008",
    "conversation_id": "conv-002",
    "sender_id": "user-002",
    "content": "Hi Sofia! I noticed you are interested in UX design. I am working on a side project and could use some design help.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-21T09:05:00Z",
    "updated_at": "2024-08-21T09:05:00Z"
  },
  {
    "id": "msg-009",
    "conversation_id": "conv-002",
    "sender_id": "user-003",
    "content": "Hey Marcus! That sounds interesting. What kind of project is it?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-21T09:30:00Z",
    "updated_at": "2024-08-21T09:30:00Z"
  },
  {
    "id": "msg-010",
    "conversation_id": "conv-002",
    "sender_id": "user-002",
    "content": "It is a mobile app for finding study spots on campus. I have the backend mostly done but need UI/UX design.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-21T09:35:00Z",
    "updated_at": "2024-08-21T09:35:00Z"
  },
  {
    "id": "msg-011",
    "conversation_id": "conv-002",
    "sender_id": "user-003",
    "content": "Oh that is such a cool idea! I would love to help. Can we meet to discuss it?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-21T09:40:00Z",
    "updated_at": "2024-08-21T09:40:00Z"
  },
  {
    "id": "msg-012",
    "conversation_id": "conv-002",
    "sender_id": "user-002",
    "content": "For sure! How about this Friday at the Student Union?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T16:45:00Z",
    "updated_at": "2024-08-25T16:45:00Z"
  },
  {
    "id": "msg-013",
    "conversation_id": "conv-003",
    "sender_id": "user-001",
    "content": "Welcome everyone to the CS 46A Study Squad! Let us use this chat to coordinate study sessions.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T12:05:00Z",
    "updated_at": "2024-08-20T12:05:00Z"
  },
  {
    "id": "msg-014",
    "conversation_id": "conv-003",
    "sender_id": "user-002",
    "content": "Awesome! Thanks for setting this up Aisha.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T12:10:00Z",
    "updated_at": "2024-08-20T12:10:00Z"
  },
  {
    "id": "msg-015",
    "conversation_id": "conv-003",
    "sender_id": "user-008",
    "content": "Hey everyone! David here. Looking forward to studying together.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T12:30:00Z",
    "updated_at": "2024-08-20T12:30:00Z"
  },
  {
    "id": "msg-016",
    "conversation_id": "conv-003",
    "sender_id": "user-017",
    "content": "Hi all! Samantha here. When should we have our first session?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T13:00:00Z",
    "updated_at": "2024-08-20T13:00:00Z"
  },
  {
    "id": "msg-017",
    "conversation_id": "conv-003",
    "sender_id": "user-001",
    "content": "How about this Thursday at 3pm in the library? The first assignment is due next week.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T13:15:00Z",
    "updated_at": "2024-08-20T13:15:00Z"
  },
  {
    "id": "msg-018",
    "conversation_id": "conv-003",
    "sender_id": "user-008",
    "content": "Works for me!",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T13:20:00Z",
    "updated_at": "2024-08-20T13:20:00Z"
  },
  {
    "id": "msg-019",
    "conversation_id": "conv-003",
    "sender_id": "user-017",
    "content": "Same here. I will bring my notes from lecture.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T13:25:00Z",
    "updated_at": "2024-08-20T13:25:00Z"
  },
  {
    "id": "msg-020",
    "conversation_id": "conv-003",
    "sender_id": "user-002",
    "content": "Count me in! Also, did anyone understand the recursion section from today?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T19:30:00Z",
    "updated_at": "2024-08-25T19:30:00Z"
  },
  {
    "id": "msg-021",
    "conversation_id": "conv-003",
    "sender_id": "user-001",
    "content": "Yes! I can walk through it Thursday. It clicked for me after doing the practice problems.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T20:00:00Z",
    "updated_at": "2024-08-25T20:00:00Z"
  },
  {
    "id": "msg-022",
    "conversation_id": "conv-004",
    "sender_id": "user-004",
    "content": "Hey Jasmine! I saw you are into finance and entrepreneurship. I am starting something and could use someone with financial modeling skills.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-22T14:05:00Z",
    "updated_at": "2024-08-22T14:05:00Z"
  },
  {
    "id": "msg-023",
    "conversation_id": "conv-004",
    "sender_id": "user-013",
    "content": "Hi Jordan! That sounds interesting. What is your startup about?",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-22T14:20:00Z",
    "updated_at": "2024-08-22T14:20:00Z"
  },
  {
    "id": "msg-024",
    "conversation_id": "conv-004",
    "sender_id": "user-004",
    "content": "It is a marketplace for student services - tutoring, design work, coding help. Peer-to-peer.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-22T14:25:00Z",
    "updated_at": "2024-08-22T14:25:00Z"
  },
  {
    "id": "msg-025",
    "conversation_id": "conv-004",
    "sender_id": "user-013",
    "content": "Love it! I have been wanting to work on something real. Let us grab coffee and talk more.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-24T11:00:00Z",
    "updated_at": "2024-08-24T11:00:00Z"
  },
  {
    "id": "msg-026",
    "conversation_id": "conv-005",
    "sender_id": "user-001",
    "content": "Team! I found a great paper on transformer architectures we should read for our project.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T15:05:00Z",
    "updated_at": "2024-08-20T15:05:00Z"
  },
  {
    "id": "msg-027",
    "conversation_id": "conv-005",
    "sender_id": "user-005",
    "content": "Share the link! I will read it this weekend.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T15:15:00Z",
    "updated_at": "2024-08-20T15:15:00Z"
  },
  {
    "id": "msg-028",
    "conversation_id": "conv-005",
    "sender_id": "user-022",
    "content": "I have already started on the data pipeline. Should have something to show by next meeting.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-20T15:30:00Z",
    "updated_at": "2024-08-20T15:30:00Z"
  },
  {
    "id": "msg-029",
    "conversation_id": "conv-005",
    "sender_id": "user-001",
    "content": "Great progress everyone! Let us sync tomorrow to review the architecture decisions.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T18:00:00Z",
    "updated_at": "2024-08-25T18:00:00Z"
  },
  {
    "id": "msg-030",
    "conversation_id": "conv-005",
    "sender_id": "user-005",
    "content": "Sounds good. I also trained a baseline model - 78% accuracy on our test set so far.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T18:10:00Z",
    "updated_at": "2024-08-25T18:10:00Z"
  },
  {
    "id": "msg-031",
    "conversation_id": "conv-005",
    "sender_id": "user-022",
    "content": "Nice! Let me look at the evaluation metrics and see where we can improve.",
    "message_type": "text",
    "metadata": null,
    "is_edited": false,
    "created_at": "2024-08-25T18:15:00Z",
    "updated_at": "2024-08-25T18:15:00Z"
  }
];
