import React, { useState, useEffect } from 'react';

// Array of options for Class, Race, Background, and Alignment
const CLASS_OPTIONS = ['Fighter', 'Wizard', 'Rogue', 'Cleric']; // Add more options as needed
const RACE_OPTIONS = ['Human', 'Elf', 'Dwarf', 'Orc']; // Add more options as needed
const BACKGROUND_OPTIONS = ['Noble', 'Criminal', 'Folk Hero', 'Sage']; // Add more options as needed
const ALIGNMENT_OPTIONS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil']; // Add more options as needed

const CharacterCreation = () => {
  const [character, setCharacter] = useState({
    name: '',
    class: '',
    level: 1,
    background: '',
    race: '',
    alignment: '',
    experiencePoints: 0,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    // ... (other character properties)
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

  return (
    <div className="min-h-screen bg-beige-light p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8" style={{background: '#F5E6D3'}}>
        <h1 className="text-4xl font-bold text-green-dark mb-8 text-center">Character Sheet</h1>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold text-green-dark mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-slate-dark mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={character.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label htmlFor="class" className="block text-slate-dark mb-1">Class & Level</label>
                <div className="flex space-x-2">
                  <select
                    id="class"
                    name="class"
                    value={character.class}
                    onChange={handleChange}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select a class</option>
                    {CLASS_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    id="level"
                    name="level"
                    value={character.level}
                  onChange={handleChange}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              </div>
              <div>
                <label htmlFor="race" className="block text-slate-dark mb-1">Race</label>
                <select
                  id="race"
                  name="race"
                  value={character.race}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select a race</option>
                  {RACE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="background" className="block text-slate-dark mb-1">Background</label>
                <select
                  id="background"
                  name="background"
                  value={character.background}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select a background</option>
                  {BACKGROUND_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="alignment" className="block text-slate-dark mb-1">Alignment</label>
                <select
                  id="alignment"
                  name="alignment"
                  value={character.alignment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select an alignment</option>
                  {ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              </div>
            </div>
            <div className="col-span-1">
            <h2 className="text-2xl font-semibold text-green-dark mb-4">Ability Scores</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="text-center bg-gold bg-opacity-20 rounded-lg p-2">
                  <label htmlFor={stat} className="block text-slate-dark mb-1 capitalize font-bold">{stat}</label>
                  <input
                    type="number"
                    id={stat}
                    name={stat}
                    value={value}
                    onChange={handleStatChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-center"
                  />
                  <div className="mt-1 text-sm font-semibold">
                    Modifier: {Math.floor((value - 10) / 2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold text-green-dark mb-4">Character Appearance</h2>
            <textarea
              id="appearance"
              name="appearance"
              value={character.appearance}
              onChange={handleChange}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          </div>
        </div>
    </div>
  );
};

export default CharacterCreation;