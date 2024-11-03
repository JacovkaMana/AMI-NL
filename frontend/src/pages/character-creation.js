import React, { useState } from 'react';
import Layout from '../components/Layout';

const CLASS_OPTIONS = ['Fighter', 'Wizard', 'Rogue', 'Cleric'];
const RACE_OPTIONS = ['Human', 'Elf', 'Dwarf', 'Orc'];
const BACKGROUND_OPTIONS = ['Noble', 'Criminal', 'Folk Hero', 'Sage'];
const ALIGNMENT_OPTIONS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

const CharacterCreation = () => {
  const [character, setCharacter] = useState({
    name: '',
    class: '',
    level: 1,
    background: '',
    race: '',
    alignment: '',
    experiencePoints: 0,
    description: '',
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCharacter((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: parseInt(value) || 0,
      },
    }));
  };

  const StatBox = ({ stat, value, onChange }) => (
    <div className="relative flex flex-col items-center p-4 border-2 border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]">
      <label className="absolute -top-3 bg-[var(--color-bg-secondary)] px-2 text-sm font-cinzel text-[var(--color-text-primary)] uppercase">
        {stat}
      </label>
      <input
        type="number"
        name={stat}
        value={value}
        onChange={onChange}
        className="w-16 h-16 text-2xl text-center border-2 border-[var(--color-border)] rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      />
      <span className="mt-2 text-sm font-roboto font-bold text-[var(--color-text-secondary)]">
        Modifier: {Math.floor((value - 10) / 2)}
      </span>
    </div>
  );

  return (
    <Layout>
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-cinzel text-[var(--color-text-primary)] border-b-2 border-[var(--color-border)] pb-2">
              Character Creation
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Character Form */}
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Basic Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-roboto font-bold mb-1 text-slate-gray">Character Name</label>
                    <input
                      type="text"
                      name="name"
                      value={character.name}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-roboto font-bold mb-1 text-slate-gray">Class</label>
                      <select
                        name="class"
                        value={character.class}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        {CLASS_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-roboto font-bold mb-1 text-slate-gray">Level</label>
                      <input
                        type="number"
                        name="level"
                        value={character.level}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Other basic info fields with updated styling */}
                  {['race', 'background', 'alignment'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-roboto font-bold mb-1 text-slate-gray capitalize">
                        {field}
                      </label>
                      <select
                        name={field}
                        value={character[field]}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        {eval(`${field.toUpperCase()}_OPTIONS`).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ability Scores Section */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Ability Scores</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(character.stats).map(([stat, value]) => (
                    <StatBox
                      key={stat}
                      stat={stat}
                      value={value}
                      onChange={handleStatChange}
                    />
                  ))}
                </div>
              </div>

              {/* Character Description Section */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Character Description</h2>
                <div>
                  <textarea
                    name="description"
                    value={character.description}
                    onChange={handleChange}
                    placeholder="Describe your character's appearance, personality, and background story..."
                    className="input-field h-48 resize-none"
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Character Preview */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] p-4 h-full">
              <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Character Preview</h2>
              <div className="w-full h-[800px] bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--color-border)]">
                <p className="text-[var(--color-text-secondary)] italic font-roboto">Character preview will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CharacterCreation;



