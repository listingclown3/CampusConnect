-- SpartanCircle Seed Data
-- This file populates the database with sample data for development/demo

-- ============================================================
-- Users
-- ============================================================

INSERT INTO users (id, email, is_active) VALUES ('user-001', 'student1@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-002', 'student2@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-003', 'student3@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-004', 'student4@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-005', 'student5@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-006', 'student6@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-007', 'student7@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-008', 'student8@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-009', 'student9@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-010', 'student10@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-011', 'student11@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-012', 'student12@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-013', 'student13@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-014', 'student14@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-015', 'student15@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-016', 'student16@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-017', 'student17@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-018', 'student18@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-019', 'student19@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-020', 'student20@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-021', 'student21@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-022', 'student22@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-023', 'student23@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-024', 'student24@sjsu.edu', true);
INSERT INTO users (id, email, is_active) VALUES ('user-025', 'student25@sjsu.edu', true);

-- ============================================================
-- Classes
-- ============================================================

INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-001', 'CS 46A', 'Introduction to Programming', 'Computer Science', '01', 'Fall', 2024, 'Dr. Smith', 'MWF 9:00-9:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-002', 'CS 46B', 'Introduction to Data Structures', 'Computer Science', '01', 'Fall', 2024, 'Dr. Johnson', 'MWF 10:00-10:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-003', 'MATH 30', 'Calculus I', 'Mathematics', '03', 'Fall', 2024, 'Dr. Lee', 'TTh 10:30-11:45');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-004', 'ENGL 1A', 'First Year Writing', 'English', '12', 'Fall', 2024, 'Prof. Davis', 'TTh 9:00-10:15');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-005', 'BUS1 20', 'Financial Accounting', 'Business', '02', 'Fall', 2024, 'Prof. Anderson', 'MWF 11:00-11:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-006', 'BIOL 30', 'Principles of Biology I', 'Biology', '01', 'Fall', 2024, 'Dr. Martinez', 'MWF 8:00-8:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-007', 'PSYC 1', 'General Psychology', 'Psychology', '04', 'Fall', 2024, 'Dr. Thompson', 'TTh 1:30-2:45');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-008', 'COMM 20', 'Public Speaking', 'Communications', '06', 'Fall', 2024, 'Prof. Wilson', 'MWF 1:00-1:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-009', 'ENGR 10', 'Introduction to Engineering', 'Engineering', '01', 'Fall', 2024, 'Dr. Patel', 'TTh 3:00-4:15');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-010', 'MATH 31', 'Calculus II', 'Mathematics', '02', 'Fall', 2024, 'Dr. Chen', 'MWF 2:00-2:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-011', 'ART 12', 'Two-Dimensional Design', 'Art', '01', 'Fall', 2024, 'Prof. Rivera', 'MW 3:00-4:15');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-012', 'CS 47', 'Introduction to Computer Systems', 'Computer Science', '01', 'Fall', 2024, 'Dr. Brown', 'TTh 10:30-11:45');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-013', 'CHEM 1A', 'General Chemistry I', 'Chemistry', '03', 'Fall', 2024, 'Dr. Garcia', 'MWF 9:00-9:50');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-014', 'CS 166', 'Information Security', 'Computer Science', '01', 'Fall', 2024, 'Dr. Kim', 'TTh 1:30-2:45');
INSERT INTO classes (id, course_code, course_name, department, section, semester, year, instructor, schedule) VALUES ('cls-015', 'MCOM 72', 'Digital Media Production', 'Mass Communications', '01', 'Fall', 2024, 'Prof. Taylor', 'MW 4:30-5:45');

-- ============================================================
-- User Classes (enrollments)
-- ============================================================

INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-001', 'user-001', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-002', 'user-001', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-003', 'user-001', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-004', 'user-002', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-005', 'user-002', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-006', 'user-002', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-007', 'user-003', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-008', 'user-003', 'cls-009');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-009', 'user-003', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-010', 'user-004', 'cls-005');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-011', 'user-004', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-012', 'user-004', 'cls-008');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-013', 'user-005', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-014', 'user-005', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-015', 'user-005', 'cls-010');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-016', 'user-006', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-017', 'user-006', 'cls-009');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-018', 'user-006', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-019', 'user-007', 'cls-007');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-020', 'user-007', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-021', 'user-007', 'cls-011');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-022', 'user-008', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-023', 'user-008', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-024', 'user-008', 'cls-012');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-025', 'user-009', 'cls-006');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-026', 'user-009', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-027', 'user-009', 'cls-013');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-028', 'user-010', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-029', 'user-010', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-030', 'user-010', 'cls-014');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-031', 'user-011', 'cls-008');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-032', 'user-011', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-033', 'user-011', 'cls-015');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-034', 'user-012', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-035', 'user-012', 'cls-009');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-036', 'user-012', 'cls-010');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-037', 'user-013', 'cls-005');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-038', 'user-013', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-039', 'user-013', 'cls-008');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-040', 'user-014', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-041', 'user-014', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-042', 'user-014', 'cls-005');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-043', 'user-015', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-044', 'user-015', 'cls-015');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-045', 'user-015', 'cls-011');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-046', 'user-016', 'cls-009');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-047', 'user-016', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-048', 'user-016', 'cls-010');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-049', 'user-017', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-050', 'user-017', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-051', 'user-017', 'cls-012');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-052', 'user-018', 'cls-006');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-053', 'user-018', 'cls-007');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-054', 'user-018', 'cls-013');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-055', 'user-019', 'cls-004');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-056', 'user-019', 'cls-008');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-057', 'user-019', 'cls-011');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-058', 'user-020', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-059', 'user-020', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-060', 'user-020', 'cls-009');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-061', 'user-021', 'cls-006');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-062', 'user-021', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-063', 'user-021', 'cls-010');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-064', 'user-022', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-065', 'user-022', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-066', 'user-022', 'cls-010');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-067', 'user-023', 'cls-005');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-068', 'user-023', 'cls-008');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-069', 'user-023', 'cls-015');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-070', 'user-024', 'cls-001');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-071', 'user-024', 'cls-002');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-072', 'user-024', 'cls-003');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-073', 'user-025', 'cls-006');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-074', 'user-025', 'cls-009');
INSERT INTO user_classes (id, user_id, class_id) VALUES ('uc-075', 'user-025', 'cls-003');

-- ============================================================
-- Clubs
-- ============================================================

INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-001', 'AI Club', 'Exploring AI, ML, and deep learning through projects and workshops.', 'Technology', 85, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-002', 'Data Science Club', 'Building data-driven projects and hosting Kaggle competitions.', 'Technology', 62, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-003', 'Software Engineering Society', 'Career development, coding challenges, and industry connections.', 'Technology', 120, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-004', 'Entrepreneurship Club', 'Startups, business innovation, and turning ideas into ventures.', 'Business', 75, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-005', 'UX Design Club', 'User experience design, prototyping, and portfolio building.', 'Design', 48, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-006', 'Pre-Med Society', 'Supporting pre-medical students with MCAT prep and clinical experience.', 'Health', 95, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-007', 'Gaming Club', 'Casual and competitive gaming, esports teams, game dev workshops.', 'Entertainment', 150, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-008', 'Spartan Racing', 'Formula SAE team designing, building, and racing cars.', 'Engineering', 35, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-009', 'Women in Business', 'Empowering women through mentorship and professional development.', 'Business', 68, true);
INSERT INTO clubs (id, name, description, category, member_count, is_active) VALUES ('club-010', 'Animation Club', '2D/3D animation, motion graphics, and visual storytelling.', 'Art', 42, true);

-- ============================================================
-- Events (sample - 15 events)
-- ============================================================

INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-001', 'Fall Welcome Mixer', 'Meet fellow students and kick off the semester.', NULL, 'Student Union', '2024-08-26 17:00', '2024-08-26 20:00', 'Social', 200);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-002', 'AI Workshop: Intro to LLMs', 'Hands-on LLM workshop.', 'club-001', 'MacQuarrie Hall 225', '2024-09-05 17:00', '2024-09-05 19:00', 'Workshop', 50);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-003', 'Startup Pitch Night', 'Student founders pitch to investors.', 'club-004', 'Business Tower 050', '2024-09-12 18:00', '2024-09-12 21:00', 'Competition', 100);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-004', 'SpartanHacks 2024', '24-hour hackathon with prizes.', 'club-003', 'Engineering Building', '2024-09-20 18:00', '2024-09-21 18:00', 'Competition', 150);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-005', 'UX Portfolio Review', 'Get feedback on your UX portfolio.', 'club-005', 'Art Building 133', '2024-09-10 16:00', '2024-09-10 18:00', 'Workshop', 30);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-006', 'Pre-Med Info Session', 'Pre-med track info at SJSU.', 'club-006', 'Duncan Hall 250', '2024-09-03 17:00', '2024-09-03 18:30', 'Info Session', 80);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-007', 'Smash Bros Tournament', 'Weekly tournament with prizes.', 'club-007', 'Student Union Game Room', '2024-09-06 19:00', '2024-09-06 22:00', 'Social', 64);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-008', 'Career Fair: Tech', 'Meet recruiters from top tech companies.', NULL, 'Event Center', '2024-09-25 10:00', '2024-09-25 15:00', 'Career', 500);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-009', 'Data Science Showcase', 'Student data science project presentations.', 'club-002', 'Engineering 285', '2024-09-17 18:00', '2024-09-17 20:00', 'Showcase', 60);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-010', 'Study Jam: CS 46B', 'Group study for CS 46B midterm.', NULL, 'King Library', '2024-10-10 14:00', '2024-10-10 18:00', 'Academic', 40);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-011', 'Women in Tech Panel', 'Women leaders share career advice.', 'club-009', 'Business Tower 100', '2024-09-18 17:30', '2024-09-18 19:30', 'Panel', 75);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-012', 'Formula SAE Design Review', 'Car design presentation.', 'club-008', 'Engineering Garage', '2024-09-13 16:00', '2024-09-13 18:00', 'Showcase', 40);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-013', 'Animation Movie Night', 'Watch and discuss animated films.', 'club-010', 'Art Building 218', '2024-09-07 18:00', '2024-09-07 21:00', 'Social', 35);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-014', 'Resume Workshop', 'Build a standout tech resume.', 'club-003', 'Engineering 189', '2024-09-04 17:30', '2024-09-04 19:00', 'Workshop', 45);
INSERT INTO events (id, title, description, club_id, location, start_time, end_time, category, max_attendees) VALUES ('evt-015', 'Outdoor Movie Night', 'Free outdoor movie screening.', NULL, 'Tower Lawn', '2024-09-14 20:00', '2024-09-14 22:30', 'Social', 300);

-- ============================================================
-- Pods
-- ============================================================

INSERT INTO pods (id, name, description, pod_type, max_members, class_id, created_by, is_active, score) VALUES ('pod-001', 'CS 46A Study Squad', 'Group study for CS 46A', 'study', 5, 'cls-001', 'user-001', true, 85);
INSERT INTO pods (id, name, description, pod_type, max_members, class_id, created_by, is_active, score) VALUES ('pod-002', 'AI Project Team', 'Building an AI study recommendation system', 'project', 4, NULL, 'user-001', true, 90);
INSERT INTO pods (id, name, description, pod_type, max_members, class_id, created_by, is_active, score) VALUES ('pod-003', 'Pre-Med Study Circle', 'MCAT prep and study support', 'study', 5, 'cls-006', 'user-009', true, 78);
INSERT INTO pods (id, name, description, pod_type, max_members, class_id, created_by, is_active, score) VALUES ('pod-004', 'Startup Founders Pod', 'Weekly check-ins for student founders', 'career', 5, NULL, 'user-004', true, 82);
INSERT INTO pods (id, name, description, pod_type, max_members, class_id, created_by, is_active, score) VALUES ('pod-005', 'Engineering Design Team', 'Collaborative engineering design challenges', 'project', 4, 'cls-009', 'user-006', true, 75);

-- Pod Members
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-001', 'pod-001', 'user-001', 'admin');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-002', 'pod-001', 'user-002', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-003', 'pod-001', 'user-008', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-004', 'pod-001', 'user-017', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-005', 'pod-002', 'user-001', 'admin');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-006', 'pod-002', 'user-005', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-007', 'pod-002', 'user-022', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-008', 'pod-003', 'user-009', 'admin');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-009', 'pod-003', 'user-018', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-010', 'pod-003', 'user-025', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-011', 'pod-004', 'user-004', 'admin');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-012', 'pod-004', 'user-014', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-013', 'pod-004', 'user-023', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-014', 'pod-004', 'user-013', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-015', 'pod-005', 'user-006', 'admin');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-016', 'pod-005', 'user-012', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-017', 'pod-005', 'user-016', 'member');
INSERT INTO pod_members (id, pod_id, user_id, role) VALUES ('pm-018', 'pod-005', 'user-025', 'member');

-- ============================================================
-- Conversations and Messages (30+ messages)
-- ============================================================

INSERT INTO conversations (id, type, name, pod_id, created_by, last_message_at) VALUES ('conv-001', 'direct', NULL, NULL, 'user-001', '2024-08-25 14:30:00');
INSERT INTO conversations (id, type, name, pod_id, created_by, last_message_at) VALUES ('conv-002', 'direct', NULL, NULL, 'user-002', '2024-08-25 16:45:00');
INSERT INTO conversations (id, type, name, pod_id, created_by, last_message_at) VALUES ('conv-003', 'pod', 'CS 46A Study Squad', 'pod-001', 'user-001', '2024-08-25 20:00:00');
INSERT INTO conversations (id, type, name, pod_id, created_by, last_message_at) VALUES ('conv-004', 'direct', NULL, NULL, 'user-004', '2024-08-24 11:00:00');
INSERT INTO conversations (id, type, name, pod_id, created_by, last_message_at) VALUES ('conv-005', 'pod', 'AI Project Team', 'pod-002', 'user-001', '2024-08-25 18:15:00');

-- Conversation Members
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-001', 'conv-001', 'user-001');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-002', 'conv-001', 'user-002');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-003', 'conv-002', 'user-002');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-004', 'conv-002', 'user-003');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-005', 'conv-003', 'user-001');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-006', 'conv-003', 'user-002');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-007', 'conv-003', 'user-008');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-008', 'conv-003', 'user-017');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-009', 'conv-004', 'user-004');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-010', 'conv-004', 'user-013');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-011', 'conv-005', 'user-001');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-012', 'conv-005', 'user-005');
INSERT INTO conversation_members (id, conversation_id, user_id) VALUES ('cm-013', 'conv-005', 'user-022');

-- Messages (31 total)
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-001', 'conv-001', 'user-001', 'Hey Marcus! I saw we are both in CS 46A. Want to study together sometime?', 'text', '2024-08-20 10:05:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-002', 'conv-001', 'user-002', 'Hey Aisha! Yeah totally, I was looking for a study partner. When are you usually free?', 'text', '2024-08-20 10:15:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-003', 'conv-001', 'user-001', 'I am usually free Tuesday and Thursday afternoons. We could meet at the library?', 'text', '2024-08-20 10:20:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-004', 'conv-001', 'user-002', 'Perfect! Thursday afternoons work great for me. King Library 4th floor?', 'text', '2024-08-20 10:25:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-005', 'conv-001', 'user-001', 'Sounds good! I also started working on the first assignment.', 'text', '2024-08-20 11:00:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-006', 'conv-001', 'user-002', 'Yes please! I got stuck on problem 3.', 'text', '2024-08-20 11:10:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-007', 'conv-001', 'user-001', 'Same here. See you Thursday then!', 'text', '2024-08-25 14:30:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-008', 'conv-002', 'user-002', 'Hi Sofia! I noticed you are interested in UX design. Working on a side project.', 'text', '2024-08-21 09:05:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-009', 'conv-002', 'user-003', 'Hey Marcus! That sounds interesting. What kind of project?', 'text', '2024-08-21 09:30:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-010', 'conv-002', 'user-002', 'A mobile app for finding study spots on campus.', 'text', '2024-08-21 09:35:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-011', 'conv-002', 'user-003', 'Cool idea! I would love to help. Can we meet?', 'text', '2024-08-21 09:40:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-012', 'conv-002', 'user-002', 'How about Friday at the Student Union?', 'text', '2024-08-25 16:45:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-013', 'conv-003', 'user-001', 'Welcome to CS 46A Study Squad!', 'text', '2024-08-20 12:05:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-014', 'conv-003', 'user-002', 'Thanks for setting this up Aisha.', 'text', '2024-08-20 12:10:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-015', 'conv-003', 'user-008', 'Hey everyone! David here.', 'text', '2024-08-20 12:30:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-016', 'conv-003', 'user-017', 'Hi all! When should we have our first session?', 'text', '2024-08-20 13:00:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-017', 'conv-003', 'user-001', 'How about Thursday at 3pm in the library?', 'text', '2024-08-20 13:15:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-018', 'conv-003', 'user-008', 'Works for me!', 'text', '2024-08-20 13:20:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-019', 'conv-003', 'user-017', 'Same here. I will bring my notes.', 'text', '2024-08-20 13:25:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-020', 'conv-003', 'user-002', 'Count me in! Did anyone understand the recursion section?', 'text', '2024-08-25 19:30:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-021', 'conv-003', 'user-001', 'Yes! I can walk through it Thursday.', 'text', '2024-08-25 20:00:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-022', 'conv-004', 'user-004', 'Hey Jasmine! I am starting something and could use financial modeling skills.', 'text', '2024-08-22 14:05:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-023', 'conv-004', 'user-013', 'Hi Jordan! What is your startup about?', 'text', '2024-08-22 14:20:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-024', 'conv-004', 'user-004', 'A marketplace for student services - tutoring, design, coding help.', 'text', '2024-08-22 14:25:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-025', 'conv-004', 'user-013', 'Love it! Let us grab coffee and talk more.', 'text', '2024-08-24 11:00:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-026', 'conv-005', 'user-001', 'Team! I found a great paper on transformer architectures.', 'text', '2024-08-20 15:05:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-027', 'conv-005', 'user-005', 'Share the link! I will read it this weekend.', 'text', '2024-08-20 15:15:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-028', 'conv-005', 'user-022', 'I have started on the data pipeline. Should have something next meeting.', 'text', '2024-08-20 15:30:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-029', 'conv-005', 'user-001', 'Great progress! Let us sync tomorrow.', 'text', '2024-08-25 18:00:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-030', 'conv-005', 'user-005', 'I trained a baseline model - 78% accuracy so far.', 'text', '2024-08-25 18:10:00');
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES ('msg-031', 'conv-005', 'user-022', 'Nice! Let me look at the evaluation metrics.', 'text', '2024-08-25 18:15:00');
