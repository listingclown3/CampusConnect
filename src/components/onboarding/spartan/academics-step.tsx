'use client';

import { useState } from 'react';
import type { Class } from '@/types/database';
import type { SelectedCourse, SpartanOnboardingState, SpartanStep } from './types';
import { SJSU_MAJORS } from './types';
import { sanitizeText } from '@/lib/validation/text';

const MAJOR_MAX_LENGTH = 100;
const CLASS_SEARCH_MAX_LENGTH = 60;

interface AcademicsStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
  onNext: () => void;
  availableClasses: Class[];
}

export function AcademicsStep({ state, updateState, setStep, onNext, availableClasses }: AcademicsStepProps) {
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
        onChange={(e) => updateState('major', sanitizeText(e.target.value, MAJOR_MAX_LENGTH))}
        placeholder="Search for your current major"
        autoComplete="off"
      />

      <input
        type="text"
        className="switch-major-search-input"
        list="sjsu-majors"
        value={state.plannedMajor}
        onChange={(e) => updateState('plannedMajor', sanitizeText(e.target.value, MAJOR_MAX_LENGTH))}
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
          onChange={(e) => setClassSearch(sanitizeText(e.target.value, CLASS_SEARCH_MAX_LENGTH))}
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
      <button type="button" className="academics-next-button" onClick={onNext}>Next</button>
    </div>
  );
}
