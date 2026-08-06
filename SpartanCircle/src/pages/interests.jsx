import { useState } from "react";
import interestsPage from "../assets/interests.png";
import "../App.css";

const exampleInterests = [
  "Music 🎵",
  "Sports 🏀",
  "Art 🎨",
  "Gaming 🎮",
  "Reading 📚",
  "Travel ✈️",
  "Cooking 🍳",
  "Dance 💃",
  "Theatre 🎭",
  "Coding 💻",
];

function Interests({ setPage }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterests, setCustomInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [studyStyle, setStudyStyle] = useState("");
  const [collaborationStyle, setCollaborationStyle] = useState("");

  function toggleInterest(interest) {
    setSelectedInterests((previousInterests) => {
      if (previousInterests.includes(interest)) {
        return previousInterests.filter(
          (selectedInterest) => selectedInterest !== interest
        );
      }

      return [...previousInterests, interest];
    });
  }

  function addCustomInterest() {
    const cleanedInterest = customInterest.trim();

    if (!cleanedInterest) {
      return;
    }

    const alreadyExists = [
      ...selectedInterests,
      ...customInterests,
    ].some(
      (interest) =>
        interest.toLowerCase() === cleanedInterest.toLowerCase()
    );

    if (!alreadyExists) {
      setCustomInterests((previousInterests) => [
        ...previousInterests,
        cleanedInterest,
      ]);
    }

    setCustomInterest("");
  }

  function removeCustomInterest(interestToRemove) {
    setCustomInterests((previousInterests) =>
      previousInterests.filter(
        (interest) => interest !== interestToRemove
      )
    );
  }

  function handleCustomInterestKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomInterest();
    }
  }

  return (
    <div className="interests-container">
      <img
        className="interests-image"
        src={interestsPage}
        alt="Interests and goals page"
      />

      {/* Example interests */}
      <div className="interest-options">
        {exampleInterests.map((interest) => {
          const isSelected = selectedInterests.includes(interest);

          return (
            <button
              key={interest}
              type="button"
              className={`interest-option-button ${
                isSelected ? "interest-selected" : ""
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {isSelected ? "✓" : "+"} {interest}
            </button>
          );
        })}
      </div>

      {/* Custom interest input */}
      <div className="custom-interest-row">
        <input
          type="text"
          className="custom-interest-input"
          value={customInterest}
          onChange={(event) =>
            setCustomInterest(event.target.value)
          }
          onKeyDown={handleCustomInterestKeyDown}
          placeholder="Add a custom interest..."
          maxLength={40}
        />

        <button
          type="button"
          className="add-interest-button"
          onClick={addCustomInterest}
        >
          Add
        </button>
      </div>

      {/* Custom interests that were added */}
      {customInterests.length > 0 && (
        <div className="custom-interest-list">
          {customInterests.map((interest) => (
            <div
              key={interest}
              className="custom-interest-tag"
            >
              <span>{interest}</span>

              <button
                type="button"
                className="remove-interest-button"
                onClick={() => removeCustomInterest(interest)}
                aria-label={`Remove ${interest}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Career goals */}
     {/* Career goals */}
    <textarea
        className="career-goals-input"
        value={careerGoals}
        onChange={(event) =>
        setCareerGoals(event.target.value)
    }
    placeholder="For example: teacher, filmmaker, nurse..."
    maxLength={150}
    rows={2}
    />

      {/* Study style */}
      <select
        className="study-style-dropdown"
        value={studyStyle}
        onChange={(event) =>
          setStudyStyle(event.target.value)
        }
      >
        <option value="">Select study style</option>
        <option value="quiet">Quiet and independent</option>
        <option value="music">
          With music or background noise
        </option>
        <option value="group">Group study sessions</option>
        <option value="visual">Visual notes and diagrams</option>
        <option value="practice">
          Practice problems and repetition
        </option>
        <option value="mixed">
          A mix of different methods
        </option>
      </select>

      {/* Collaboration style */}
      <select
        className="collaboration-style-dropdown"
        value={collaborationStyle}
        onChange={(event) =>
          setCollaborationStyle(event.target.value)
        }
      >
        <option value="">Select collaboration style</option>
        <option value="leader">I like taking the lead</option>
        <option value="supporter">
          I prefer supporting the group
        </option>
        <option value="brainstormer">
          I enjoy brainstorming ideas
        </option>
        <option value="planner">
          I like organizing and planning
        </option>
        <option value="independent">
          I prefer working independently
        </option>
        <option value="flexible">
          I adapt to what the group needs
        </option>
      </select>

      {/* Back button */}
      <button
        type="button"
        className="interests-back-button"
        onClick={() => setPage("academics")}
        aria-label="Go back to academics"
      />

      {/* Next button */}
      <button
        type="button"
        className="interests-next-button"
        onClick={() => setPage("skills")}
        aria-label="Continue to skills"
      />
    </div>
  );
}

export default Interests;