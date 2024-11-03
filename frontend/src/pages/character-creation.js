import React, { useState } from 'react';

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
    <div className="relative flex flex-col items-center p-4 border-2 border-gray-700 rounded-lg bg-opacity-50 bg-gray-100">
      <label className="absolute -top-3 bg-gray-100 px-2 text-sm font-medieval text-gray-700 uppercase">
        {stat}
      </label>
      <input
        type="number"
        name={stat}
        value={value}
        onChange={onChange}
        className="w-16 h-16 text-2xl text-center border-2 border-gray-700 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="mt-2 text-sm font-bold">
        Modifier: {Math.floor((value - 10) / 2)}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#2c3e50] py-8 px-4">
      <div className="max-w-7xl mx-auto bg-parchment rounded-lg shadow-2xl border-4 border-[#8B4513] p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-medieval text-[#8B4513] border-b-2 border-[#8B4513] pb-2">
            Character Creation
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Character Form */}
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 border-2 border-[#8B4513]">
              <h2 className="text-xl font-medieval text-[#8B4513] mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Character Name</label>
                  <input
                    type="text"
                    name="name"
                    value={character.name}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-gray-700 rounded bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-bold mb-1">Class</label>
                    <select
                      name="class"
                      value={character.class}
                      onChange={handleChange}
                      className="w-full p-2 border-2 border-gray-700 rounded bg-white"
                    >
                      <option value="">Select...</option>
                      {CLASS_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Level</label>
                    <input
                      type="number"
                      name="level"
                      value={character.level}
                      onChange={handleChange}
                      className="w-full p-2 border-2 border-gray-700 rounded bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Race</label>
                  <select
                    name="race"
                    value={character.race}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-gray-700 rounded bg-white"
                  >
                    <option value="">Select...</option>
                    {RACE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Background</label>
                  <select
                    name="background"
                    value={character.background}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-gray-700 rounded bg-white"
                  >
                    <option value="">Select...</option>
                    {BACKGROUND_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Alignment</label>
                  <select
                    name="alignment"
                    value={character.alignment}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-gray-700 rounded bg-white"
                  >
                    <option value="">Select...</option>
                    {ALIGNMENT_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ability Scores Section */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 border-2 border-[#8B4513]">
              <h2 className="text-xl font-medieval text-[#8B4513] mb-4">Ability Scores</h2>
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
            <div className="bg-white bg-opacity-60 rounded-lg p-4 border-2 border-[#8B4513]">
              <h2 className="text-xl font-medieval text-[#8B4513] mb-4">Character Description</h2>
              <div>
                <textarea
                  name="description"
                  value={character.description}
                  onChange={handleChange}
                  placeholder="Describe your character's appearance, personality, and background story..."
                  className="w-full h-48 p-3 border-2 border-gray-700 rounded bg-white resize-none"
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Character Preview */}
          <div className="bg-white bg-opacity-60 rounded-lg border-2 border-[#8B4513] p-4 h-full">
            <h2 className="text-xl font-medieval text-[#8B4513] mb-4">Character Preview</h2>
            <div className="w-full h-[800px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 italic">Character preview will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;



