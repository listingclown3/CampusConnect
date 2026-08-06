import { useState } from "react";
import availabilityPage from "../assets/availability.png";
import "../App.css";


const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 21;

const calendarHours = Array.from(
  {
    length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1,
  },
  (_, index) => CALENDAR_START_HOUR + index
);

function Availability({
  setPage,
  selectedClasses = [],
}) {
  const [selectedCourseCode, setSelectedCourseCode] =
    useState("");

  const [selectedDay, setSelectedDay] =
    useState("Monday");

  const [startTime, setStartTime] =
    useState("09:00");

  const [endTime, setEndTime] =
    useState("10:00");

  const [classMeetings, setClassMeetings] =
    useState([]);

  /*
    This allows selectedClasses to work whether each class is:

    { code: "CS 46A", title: "Introduction to Programming" }

    or simply:

    "CS 46A"
  */
  const normalizedClasses = selectedClasses.map((course) => {
    if (typeof course === "string") {
      return {
        code: course,
        title: "",
      };
    }

    return course;
  });

  function addClassMeeting() {
    const selectedCourse = normalizedClasses.find(
      (course) => course.code === selectedCourseCode
    );

    if (!selectedCourse) {
      alert("Please select a class.");
      return;
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      alert("The end time must be after the start time.");
      return;
    }

    const calendarStartMinutes =
      CALENDAR_START_HOUR * 60;

    const calendarEndMinutes =
      CALENDAR_END_HOUR * 60;

    if (
      timeToMinutes(startTime) < calendarStartMinutes ||
      timeToMinutes(endTime) > calendarEndMinutes
    ) {
      alert(
        `Please choose a time between ${formatHour(
          CALENDAR_START_HOUR
        )} and ${formatHour(CALENDAR_END_HOUR)}.`
      );

      return;
    }

    const newMeeting = {
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,

      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
      day: selectedDay,
      startTime,
      endTime,
    };

    setClassMeetings((previousMeetings) => [
      ...previousMeetings,
      newMeeting,
    ]);
  }

  function removeClassMeeting(meetingId) {
    setClassMeetings((previousMeetings) =>
      previousMeetings.filter(
        (meeting) => meeting.id !== meetingId
      )
    );
  }

  function getMeetingStyle(meeting) {
    const calendarStartMinutes =
      CALENDAR_START_HOUR * 60;

    const calendarEndMinutes =
      CALENDAR_END_HOUR * 60;

    const calendarDuration =
      calendarEndMinutes - calendarStartMinutes;

    const meetingStart =
      timeToMinutes(meeting.startTime);

    const meetingEnd =
      timeToMinutes(meeting.endTime);

    const topPercent =
      ((meetingStart - calendarStartMinutes) /
        calendarDuration) *
      100;

    const heightPercent =
      ((meetingEnd - meetingStart) /
        calendarDuration) *
      100;

    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
    };
  }

  return (
    <div className="availability-container">
      <img
        className="availability-image"
        src={availabilityPage}
        alt="Availability page"
      />

      {/* Compact form used to add meetings */}
      <div className="availability-meeting-form">
        <select
          className="availability-course-dropdown"
          value={selectedCourseCode}
          onChange={(event) =>
            setSelectedCourseCode(event.target.value)
          }
        >
          <option value="">Select a class</option>

          {normalizedClasses.map((course) => (
            <option
              key={`${course.code}-${course.title}`}
              value={course.code}
            >
              {course.code}
              {course.title
                ? ` — ${course.title}`
                : ""}
            </option>
          ))}
        </select>

        <select
          className="availability-day-dropdown"
          value={selectedDay}
          onChange={(event) =>
            setSelectedDay(event.target.value)
          }
        >
          {weekDays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label className="availability-time-field">
          <span>Start</span>

          <input
            type="time"
            value={startTime}
            min="08:00"
            max="21:00"
            onChange={(event) =>
              setStartTime(event.target.value)
            }
          />
        </label>

        <label className="availability-time-field">
          <span>End</span>

          <input
            type="time"
            value={endTime}
            min="08:00"
            max="21:00"
            onChange={(event) =>
              setEndTime(event.target.value)
            }
          />
        </label>

        <button
          type="button"
          className="add-class-meeting-button"
          onClick={addClassMeeting}
        >
          Add
        </button>
      </div>

      {normalizedClasses.length === 0 && (
        <p className="availability-empty-message">
          No classes have been selected yet. Go back to
          Academics and choose your current classes.
        </p>
      )}

      {/* Scrollable weekly calendar */}
      <div className="availability-calendar-window">
        <div className="availability-calendar">
          {/* Top-left empty corner */}
          <div className="calendar-corner" />

          {/* Weekday headings */}
          {weekDays.map((day) => (
            <div
              className="calendar-day-heading"
              key={day}
            >
              {day.slice(0, 3)}
            </div>
          ))}

          {/* Time labels */}
          <div className="calendar-time-column">
            {calendarHours
              .slice(0, -1)
              .map((hour) => (
                <div
                  className="calendar-time-label"
                  key={hour}
                >
                  {formatHour(hour)}
                </div>
              ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => (
            <div
              className="calendar-day-column"
              key={day}
            >
              {/* Horizontal hour lines */}
              {calendarHours
                .slice(0, -1)
                .map((hour) => (
                  <div
                    className="calendar-hour-row"
                    key={`${day}-${hour}`}
                  />
                ))}

              {/* Meetings for this day */}
              {classMeetings
                .filter(
                  (meeting) => meeting.day === day
                )
                .map((meeting) => (
                  <div
                    className="calendar-class-block"
                    key={meeting.id}
                    style={getMeetingStyle(meeting)}
                    title={`${meeting.courseCode}: ${formatTime(
                      meeting.startTime
                    )}–${formatTime(
                      meeting.endTime
                    )}`}
                  >
                    <strong>
                      {meeting.courseCode}
                    </strong>

                    <span>
                      {formatTime(meeting.startTime)}
                      –
                      {formatTime(meeting.endTime)}
                    </span>

                    <button
                      type="button"
                      className="remove-meeting-button"
                      onClick={() =>
                        removeClassMeeting(meeting.id)
                      }
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

      {/* Invisible Back arrow */}
      <button
        type="button"
        className="availability-back-button"
        onClick={() => setPage("skills")}
        aria-label="Go back to skills"
      />

      {/* Invisible Next arrow */}
      <button
        type="button"
        className="availability-next-button"
        onClick={() => setPage("privacy")}
        aria-label="Continue to privacy"
      />
    </div>
  );
}

function timeToMinutes(time) {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function formatHour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour =
    hour === 0
      ? 12
      : hour > 12
        ? hour - 12
        : hour;

  return `${displayHour} ${suffix}`;
}

function formatTime(time) {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  const suffix = hours >= 12 ? "PM" : "AM";

  const displayHour =
    hours === 0
      ? 12
      : hours > 12
        ? hours - 12
        : hours;

  return `${displayHour}:${String(minutes).padStart(
    2,
    "0"
  )} ${suffix}`;
}

export default Availability;