'use client';

import { useState } from 'react';
import type { ClassMeeting, SpartanOnboardingState, SpartanStep } from './types';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 21;
const calendarHours = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_, i) => CALENDAR_START_HOUR + i
);

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatHour(hour: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour} ${suffix}`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

interface AvailabilityStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
}

export function AvailabilityStep({ state, updateState, setStep }: AvailabilityStepProps) {
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const classes = state.selectedClasses;

  function addClassMeeting() {
    const course = classes.find((c) => c.code === selectedCourseCode);
    if (!course) {
      alert('Please select a class.');
      return;
    }
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      alert('The end time must be after the start time.');
      return;
    }
    const calendarStart = CALENDAR_START_HOUR * 60;
    const calendarEnd = CALENDAR_END_HOUR * 60;
    if (timeToMinutes(startTime) < calendarStart || timeToMinutes(endTime) > calendarEnd) {
      alert(`Please choose a time between ${formatHour(CALENDAR_START_HOUR)} and ${formatHour(CALENDAR_END_HOUR)}.`);
      return;
    }

    const newMeeting: ClassMeeting = {
      id: `${Date.now()}-${Math.random()}`,
      courseCode: course.code,
      courseTitle: course.title,
      day: selectedDay,
      startTime,
      endTime,
    };
    updateState('classMeetings', [...state.classMeetings, newMeeting]);
  }

  function removeClassMeeting(id: string) {
    updateState('classMeetings', state.classMeetings.filter((m) => m.id !== id));
  }

  function getMeetingStyle(meeting: ClassMeeting) {
    const calendarStart = CALENDAR_START_HOUR * 60;
    const calendarEnd = CALENDAR_END_HOUR * 60;
    const duration = calendarEnd - calendarStart;
    const start = timeToMinutes(meeting.startTime);
    const end = timeToMinutes(meeting.endTime);
    return {
      top: `${((start - calendarStart) / duration) * 100}%`,
      height: `${((end - start) / duration) * 100}%`,
    };
  }

  return (
    <div className="availability-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="availability-image" src="/onboarding/availability.png" alt="Availability page" />

      <div className="availability-meeting-form">
        <select
          className="availability-course-dropdown"
          value={selectedCourseCode}
          onChange={(e) => setSelectedCourseCode(e.target.value)}
        >
          <option value="">Select a class</option>
          {classes.map((course) => (
            <option key={course.id} value={course.code}>
              {course.code}{course.title ? ` — ${course.title}` : ''}
            </option>
          ))}
        </select>

        <select className="availability-day-dropdown" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {weekDays.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <label className="availability-time-field">
          <span>Start</span>
          <input type="time" value={startTime} min="08:00" max="21:00" onChange={(e) => setStartTime(e.target.value)} />
        </label>

        <label className="availability-time-field">
          <span>End</span>
          <input type="time" value={endTime} min="08:00" max="21:00" onChange={(e) => setEndTime(e.target.value)} />
        </label>

        <button type="button" className="add-class-meeting-button" onClick={addClassMeeting}>Add</button>
      </div>

      {classes.length === 0 && (
        <p className="availability-empty-message">
          No classes have been selected yet. Go back to Academics and choose your current classes.
        </p>
      )}

      <div className="availability-calendar-window">
        <div className="availability-calendar">
          <div className="calendar-corner" />
          {weekDays.map((day) => (
            <div className="calendar-day-heading" key={day}>{day.slice(0, 3)}</div>
          ))}

          <div className="calendar-time-column">
            {calendarHours.slice(0, -1).map((hour) => (
              <div className="calendar-time-label" key={hour}>{formatHour(hour)}</div>
            ))}
          </div>

          {weekDays.map((day) => (
            <div className="calendar-day-column" key={day}>
              {calendarHours.slice(0, -1).map((hour) => (
                <div className="calendar-hour-row" key={`${day}-${hour}`} />
              ))}
              {state.classMeetings
                .filter((m) => m.day === day)
                .map((meeting) => (
                  <div
                    className="calendar-class-block"
                    key={meeting.id}
                    style={getMeetingStyle(meeting)}
                    title={`${meeting.courseCode}: ${formatTime(meeting.startTime)}–${formatTime(meeting.endTime)}`}
                  >
                    <strong>{meeting.courseCode}</strong>
                    <span>{formatTime(meeting.startTime)}–{formatTime(meeting.endTime)}</span>
                    <button
                      type="button"
                      className="remove-meeting-button"
                      onClick={() => removeClassMeeting(meeting.id)}
                      aria-label={`Remove ${meeting.courseCode} on ${meeting.day}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="availability-back-button"
        onClick={() => setStep('skills')}
        aria-label="Go back to skills"
      />
      <button
        type="button"
        className="availability-next-button"
        onClick={() => setStep('privacy')}
        aria-label="Continue to privacy"
      />
    </div>
  );
}
