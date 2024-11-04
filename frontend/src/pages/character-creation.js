import React, { useState } from 'react';
import Layout from '../components/Layout';

const CLASS_OPTIONS = ['Fighter', 'Wizard', 'Rogue', 'Cleric'];
const RACE_OPTIONS = ['Human', 'Elf', 'Dwarf', 'Orc'];
const BACKGROUND_OPTIONS = ['Noble', 'Criminal', 'Folk Hero', 'Sage'];
const ALIGNMENT_OPTIONS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

const SKILLS = {
  acrobatics: { stat: 'dexterity', name: 'Acrobatics' },
  'animal-handling': { stat: 'wisdom', name: 'Animal Handling' },
  arcana: { stat: 'intelligence', name: 'Arcana' },
  athletics: { stat: 'strength', name: 'Athletics' },
  deception: { stat: 'charisma', name: 'Deception' },
  history: { stat: 'intelligence', name: 'History' },
  insight: { stat: 'wisdom', name: 'Insight' },
  intimidation: { stat: 'charisma', name: 'Intimidation' },
  investigation: { stat: 'intelligence', name: 'Investigation' },
  medicine: { stat: 'wisdom', name: 'Medicine' },
  nature: { stat: 'intelligence', name: 'Nature' },
  perception: { stat: 'wisdom', name: 'Perception' },
  performance: { stat: 'charisma', name: 'Performance' },
  persuasion: { stat: 'charisma', name: 'Persuasion' },
  religion: { stat: 'intelligence', name: 'Religion' },
  'sleight-of-hand': { stat: 'dexterity', name: 'Sleight of Hand' },
  stealth: { stat: 'dexterity', name: 'Stealth' },
  survival: { stat: 'wisdom', name: 'Survival' }
};

const SIZE_OPTIONS = ['Tiny', 'Small', 'Medium', 'Large'];
const DEFAULT_HIT_DICE = {
  'Fighter': 'd10',
  'Wizard': 'd6',
  'Rogue': 'd8',
  'Cleric': 'd8'
};

const DEFAULT_HP_BY_CLASS = {
  'Fighter': 10,
  'Wizard': 6,
  'Rogue': 8,
  'Cleric': 8
};

const CharacterCreation = () => {
  const [character, setCharacter] = useState({
    name: '',
    class: '',
    background: '',
    race: '',
    alignment: '',
    size: 'Medium',
    description: '',
    armor_class: 10,
    initiative: 0,
    speed: 30,
    hit_points: 0,
    temp_hit_points: 0,
    hit_dice: '',
    experiencePoints: 0,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    saving_throws: {
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false
    },
    skills: Object.keys(SKILLS).reduce((acc, skill) => ({
      ...acc,
      [skill]: false
    }), {}),
    proficiencies: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const calculateModifier = (value) => Math.floor((value - 10) / 2);

  const handleProficiencyToggle = (skillId) => {
    setCharacter(prev => ({
      ...prev,
      proficiencies: {
        ...prev.proficiencies,
        [skillId]: !prev.proficiencies?.[skillId]
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'class') {
      updateDerivedStats(value, character.stats);
    }
    setCharacter((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    const newStats = {
      ...character.stats,
      [name]: parseInt(value) || 0,
    };
    setCharacter((prev) => ({
      ...prev,
      stats: newStats,
    }));
    updateDerivedStats(character.class, newStats);
  };

  const StatBox = ({ stat, value, onChange, character, skills, onProficiencyToggle }) => {
    const modifier = calculateModifier(value);
    const relatedSkills = Object.entries(skills).filter(([_, skill]) => skill.stat === stat.toLowerCase());

    return (
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
        <span className="mt-2 text-sm font-roboto text-[var(--color-text-primary)]">
          Modifier: {modifier >= 0 ? `+${modifier}` : modifier}
        </span>
        
        {/* Updated Skills Section with styled checkbox */}
        <div className="mt-4 w-full space-y-2">
          {relatedSkills.map(([skillId, { name }]) => {
            const isProficient = character?.proficiencies?.[skillId] || false;
            const totalBonus = modifier + (isProficient ? 2 : 0);

            return (
              <div key={skillId} className="flex items-center justify-between text-[var(--color-text-primary)]">
                <label className="flex items-center space-x-2 text-[var(--color-text-primary)]">
                  <input
                    type="checkbox"
                    checked={isProficient}
                    onChange={() => handleProficiencyToggle(skillId)}
                    className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-offset-0 focus:ring-2 transition-colors duration-200"
                  />
                  <span className="text-[var(--color-text-primary)]">{name}</span>
                </label>
                <span className="text-[var(--color-text-primary)]">+{totalBonus}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const updateDerivedStats = (newClass, stats) => {
    setCharacter(prev => {
      const hitDice = DEFAULT_HIT_DICE[newClass] || '';
      const baseHP = DEFAULT_HP_BY_CLASS[newClass] || 0;
      const constitutionMod = calculateModifier(stats?.constitution || prev.stats.constitution);
      
      return {
        ...prev,
        hit_dice: hitDice,
        hit_points: baseHP + constitutionMod,
        initiative: calculateModifier(stats?.dexterity || prev.stats.dexterity),
        armor_class: 10 + calculateModifier(stats?.dexterity || prev.stats.dexterity)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: character.name,
      race: character.race,
      alignment: character.alignment,
      size: character.size,
      description: character.description,
      background: character.background,
      strength: character.stats.strength,
      dexterity: character.stats.dexterity,
      constitution: character.stats.constitution,
      intelligence: character.stats.intelligence,
      wisdom: character.stats.wisdom,
      charisma: character.stats.charisma,
      armor_class: character.armor_class,
      initiative: character.initiative,
      speed: character.speed,
      hit_points: character.hit_points,
      temp_hit_points: character.temp_hit_points,
      hit_dice: character.hit_dice,
      saving_throws: character.saving_throws,
      skills: character.skills,
      character_class: character.class,
      subclass: ''
    };

    try {
      const response = await fetch('http://localhost:8000/api/characters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create character');
      }

      const data = await response.json();
      alert('Character created successfully!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCombatStats = () => (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Combat Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
            Armor Class
          </label>
          <input
            type="number"
            value={character.armor_class}
            disabled
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
            Initiative
          </label>
          <input
            type="number"
            value={character.initiative}
            disabled
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
            Hit Points
          </label>
          <input
            type="number"
            value={character.hit_points}
            disabled
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
            Hit Dice
          </label>
          <input
            type="text"
            value={character.hit_dice}
            disabled
            className="input-field"
          />
        </div>
      </div>
    </div>
  );

  const handleGeneratePreview = () => {
    // This will be implemented later
    console.log('Generating preview...');
  };

  return (
    <Layout>
      <div className="py-8 px-4">
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border)] p-8">
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
                    <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">Character Name</label>
                    <input
                      type="text"
                      name="name"
                      value={character.name}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">Class</label>
                      <select
                        name="class"
                        value={character.class}
                        onChange={handleChange}
                        className="input-field w-full"
                      >
                        <option value="">Select...</option>
                        {CLASS_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Other basic info fields with updated styling */}
                  {['race', 'background', 'alignment'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)] capitalize">
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

              {/* Combat Stats section */}
              {renderCombatStats()}

              {/* Ability Scores Section */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Ability Scores & Skills</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(character.stats).map(([stat, value]) => (
                    <StatBox
                      key={stat}
                      stat={stat}
                      value={value}
                      onChange={handleStatChange}
                      character={character}
                      skills={SKILLS}
                      onProficiencyToggle={handleProficiencyToggle}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Description and Preview */}
            <div className="space-y-6">
              {/* Character Description Section */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Character Description</h2>
                <div className="space-y-4">
                  <textarea
                    name="description"
                    value={character.description}
                    onChange={handleChange}
                    placeholder="Describe your character's appearance, personality, and background story..."
                    className="input-field h-32 resize-none text-[var(--color-text-primary)] placeholder-[var(--color-text-primary)] opacity-60"
                    rows={6}
                  />
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    className="w-full py-2 px-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold rounded-lg shadow transition duration-200 ease-in-out transform hover:-translate-y-1"
                  >
                    Generate Preview
                  </button>
                </div>
              </div>

              {/* Character Preview */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] p-4">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Character Preview</h2>
                <div className="w-full h-[400px] bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--color-border)]">
                  <p className="text-[var(--color-text-primary)] italic font-roboto">Character preview will appear here</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {error && (
              <div className="text-[var(--color-text-primary)] text-sm font-roboto text-center bg-[var(--color-bg-error)] p-2 rounded">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Creating Character...' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CharacterCreation;



