import { useState } from "react";
import skillsPage from "../assets/skills.png";
import "../App.css";

const exampleSkills = [
  "Coding 💻",
  "Designing 🎨",
  "Research 🔎",
  "Speaking 🎤",
  "Teamwork 🌟",
  "Tutoring 📚",
  "Research 🔬",
  "Writing ✍️",
];

const exampleConnections = [
  "Friends 🤝",
  "Club Buddies 👥",
  "Study Buddy 📚",
  "Project Partners 💻",
  "Commute Buddies 🚗",
  "Networking 💼",
];

function Skills({ setPage }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkills, setCustomSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [selectedConnections, setSelectedConnections] = useState([]);

  function toggleSkill(skill) {
    setSelectedSkills((previousSkills) => {
      if (previousSkills.includes(skill)) {
        return previousSkills.filter(
          (selectedSkill) => selectedSkill !== skill
        );
      }

      return [...previousSkills, skill];
    });
  }

  function addCustomSkill() {
    const cleanedSkill = customSkill.trim();

    if (!cleanedSkill) {
      return;
    }

    const alreadyExists = [
      ...selectedSkills,
      ...customSkills,
    ].some(
      (skill) =>
        skill.toLowerCase() === cleanedSkill.toLowerCase()
    );

    if (!alreadyExists) {
      setCustomSkills((previousSkills) => [
        ...previousSkills,
        cleanedSkill,
      ]);
    }

    setCustomSkill("");
  }

  function removeCustomSkill(skillToRemove) {
    setCustomSkills((previousSkills) =>
      previousSkills.filter(
        (skill) => skill !== skillToRemove
      )
    );
  }

  function handleCustomSkillKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomSkill();
    }
  }

  function toggleConnection(connection) {
    setSelectedConnections((previousConnections) => {
      if (previousConnections.includes(connection)) {
        return previousConnections.filter(
          (selectedConnection) =>
            selectedConnection !== connection
        );
      }

      return [...previousConnections, connection];
    });
  }

  return (
    <div className="skills-container">
      <img
        className="skills-image"
        src={skillsPage}
        alt="Skills page"
      />

      {/* Example skills */}
      <div className="skill-options">
        {exampleSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);

          return (
            <button
              key={skill}
              type="button"
              className={`skill-option-button ${
                isSelected ? "skill-selected" : ""
              }`}
              onClick={() => toggleSkill(skill)}
            >
              {isSelected ? "✓" : "+"} {skill}
            </button>
          );
        })}
      </div>

      {/* Custom skill input */}
      <div className="custom-skill-row">
        <input
          type="text"
          className="custom-skill-input"
          value={customSkill}
          onChange={(event) =>
            setCustomSkill(event.target.value)
          }
          onKeyDown={handleCustomSkillKeyDown}
          placeholder="Add a custom skill..."
          maxLength={40}
        />

        <button
          type="button"
          className="add-skill-button"
          onClick={addCustomSkill}
        >
          Add
        </button>
      </div>

      {/* Custom skills */}
      {customSkills.length > 0 && (
        <div className="custom-skill-list">
          {customSkills.map((skill) => (
            <div
              key={skill}
              className="custom-skill-tag"
            >
              <span>{skill}</span>

              <button
                type="button"
                className="remove-skill-button"
                onClick={() => removeCustomSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Connection choices */}
      <div className="connection-options">
        {exampleConnections.map((connection) => {
          const isSelected =
            selectedConnections.includes(connection);

          return (
            <button
              key={connection}
              type="button"
              className={`connection-option-button ${
                isSelected ? "connection-selected" : ""
              }`}
              onClick={() => toggleConnection(connection)}
            >
              {isSelected ? "✓" : "+"} {connection}
            </button>
          );
        })}
      </div>

      {/* Back button */}
      <button
        type="button"
        className="skills-back-button"
        onClick={() => setPage("interests")}
        aria-label="Go back to interests"
      />

      {/* Next button */}
      <button
        type="button"
        className="skills-next-button"
        onClick={() => setPage("availability")}
        aria-label="Continue to availability"
      />
    </div>
  );
}

export default Skills;