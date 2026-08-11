'use client';

import { useState } from 'react';
import type { Class } from '@/types/database';
import type { SelectedCourse, SpartanOnboardingState, SpartanStep } from './types';

// Full SJSU catalog (same 80-major list used by the standard onboarding form).
const SJSU_MAJORS = [
  'Advertising', 'Aerospace Engineering', 'African American Studies', 'Animation & Illustration',
  'Anthropology', 'Applied Mathematics', 'Art', 'Art History and Visual Culture', 'Aviation',
  'Behavioral Science', 'Biological Sciences', 'Biological Sciences - Ecology and Evolution',
  'Biological Sciences - Marine Biology', 'Biomedical Engineering', 'Business Administration',
  'Chemical Engineering', 'Chemistry', 'Chicana and Chicano Studies', 'Child and Adolescent Development',
  'Chinese', 'Civil Engineering', 'Climate Science', 'Communication Studies',
  'Communicative Disorders and Sciences', 'Computer Engineering', 'Computer Science', 'Creative Arts',
  'Dance', 'Data Science', 'Design Studies', 'Earth System Science', 'Economics', 'Electrical Engineering',
  'Engineering Technology', 'English', 'Environmental Studies', 'Forensic Science', 'French', 'Geography',
  'Geology', 'Global Studies', 'Graphic Design', 'History', 'Humanities', 'Industrial Design',
  'Industrial and Systems Engineering', 'Information Science and Data Analytics', 'Interdisciplinary Engineering',
  'Interdisciplinary Studies', 'Interior Design', 'Japanese', 'Journalism', 'Justice Studies', 'Kinesiology',
  'Liberal Studies', 'Linguistics', 'Materials Engineering', 'Mathematics', 'Mechanical Engineering',
  'Meteorology', 'Music', 'Nursing', 'Nutritional Science', 'Organizational Studies', 'Packaging',
  'Philosophy', 'Physics', 'Political Science', 'Psychology', 'Public Health', 'Public Relations',
  'Radio-Television-Film', 'Recreation', 'Social Science', 'Social Work', 'Sociology', 'Software Engineering',
  'Spanish', 'Statistics', 'Theatre Arts', 'Undeclared',
];

interface AcademicsStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
  availableClasses: Class[];
}

export function AcademicsStep({ state, updateState, setStep, availableClasses }: AcademicsStepProps) {
  const [classSearch, setClassSearch] = useState('');

  function addClass(course: SelectedCourse) {
    if (state.selectedClasses.some((c) => c.id === course.id)) {
      setClassSearch('');
      return;
    }
    updateState('selectedClasses', [...state.selectedClasses, course]);
    setClassSearch('');
  }

  function removeClass(id: string) {
    updateState('selectedClasses', state.selectedClasses.filter((c) => c.id !== id));
  }

  const cleanedSearch = classSearch.trim().toLowerCase();
  const filteredCourses = cleanedSearch
    ? availableClasses.filter(
        (c) =>
          c.course_code.toLowerCase().includes(cleanedSearch) ||
          c.course_name.toLowerCase().includes(cleanedSearch)
      )
    : [];

  return (
    <div className="academics-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="academics-image" src="/onboarding/academics.png" alt="Academics Page" />

      <input
        type="text"
        className="major-search-input"
        list="sjsu-majors"
        value={state.major}
        onChange={(e) => updateState('major', e.target.value)}
        placeholder="Search for your current major"
        autoComplete="off"
      />

      <input
        type="text"
        className="switch-major-search-input"
        list="sjsu-majors"
        value={state.plannedMajor}
        onChange={(e) => updateState('plannedMajor', e.target.value)}
        placeholder="Search for a major you may switch to"
        autoComplete="off"
      />

      <datalist id="sjsu-majors">
        {SJSU_MAJORS.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>

      <div className="class-selector">
        <input
          type="text"
          className="class-search-input"
          value={classSearch}
          onChange={(e) => setClassSearch(e.target.value)}
          placeholder="Search by course code or title"
          autoComplete="off"
        />

        {cleanedSearch && (
          <div className="class-search-results">
            {filteredCourses.length > 0 ? (
              filteredCourses.slice(0, 8).map((course) => {
                const isSelected = state.selectedClasses.some((c) => c.id === course.id);
                return (
                  <button
                    type="button"
                    className="class-result-button"
                    key={course.id}
                    onClick={() => addClass({ id: course.id, code: course.course_code, title: course.course_name })}
                    disabled={isSelected}
                  >
                    <strong>{course.course_code}</strong>
                    <span>{course.course_name}</span>
                    {isSelected && <span className="already-selected-text">Already selected</span>}
                  </button>
                );
              })
            ) : (
              <p className="no-class-results">No matching classes found</p>
            )}
          </div>
        )}

        <div className="selected-classes">
          {state.selectedClasses.map((course) => (
            <div className="selected-class-tag" key={course.id}>
              <span>{course.code} — {course.title}</span>
              <button
                type="button"
                className="remove-class-button"
                onClick={() => removeClass(course.id)}
                aria-label={`Remove ${course.code}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="academics-back-button" onClick={() => setStep('basic')}>Back</button>
      <button type="button" className="academics-next-button" onClick={() => setStep('interests')}>Next</button>
    </div>
  );
}
