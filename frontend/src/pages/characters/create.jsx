import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Constants
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

export default function CreateCharacter() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const imgRef = useRef(null);

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
    proficiencies: {},
    image_path: '',
    iconBlob: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedIcon, setCroppedIcon] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

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
      subclass: '',
      image_path: character.image_path,
    };

    try {
      const newCharacter = await api.post('/api/characters/', payload);
      
      if (character.iconBlob) {
        const formData = new FormData();
        formData.append('file', character.iconBlob, 'icon.jpg');
        formData.append('character_id', newCharacter.data.id);

        await api.post('/api/upload-image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Character created successfully!');
      router.push('/characters');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      const prompt = `A fantasy character portrait of a ${character.race} ${character.class}. 
        ${character.description || ''}`;

      const response = await api.post('/api/image-generation/generate', {
        prompt: prompt
      });

      if (response.data && response.data.image_path) {
        const imagePath = response.data.image_path;
        setGeneratedImage(imagePath);
        setCharacter(prev => ({
          ...prev,
          image_path: imagePath
        }));
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate character preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceDescription = async (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (!character.description.trim()) return;
      
      setIsEnhancing(true);
      try {
        const response = await api.post('/api/image-generation/enhance', {
          prompt: character.description
        });

        if (response.data && response.data.enhanced_prompt) {
          setCharacter(prev => ({
            ...prev,
            description: response.data.enhanced_prompt
          }));
        }
      } catch (error) {
        console.error('Failed to enhance description:', error);
      } finally {
        setIsEnhancing(false);
      }
    }
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
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">
                  Character Description
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      name="description"
                      value={character.description}
                      onChange={handleChange}
                      onKeyDown={handleEnhanceDescription}
                      placeholder="Describe your character's appearance, personality, and background story... Press Tab to enhance"
                      className="input-field h-32 resize-none text-[var(--color-text-primary)] placeholder-[var(--color-text-primary)] opacity-60"
                      rows={6}
                    />
                    {isEnhancing && (
                      <div className="absolute inset-0 bg-[var(--color-bg-secondary)] bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-accent)]"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] italic">
                    Press Tab to enhance your description with AI-generated details
                  </p>
                </div>
              </div>

              {/* Character Preview */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Character Preview</h2>
                
                {/* Main Preview Area */}
                <div className="w-full h-[400px] bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--color-border)] overflow-hidden">
                  {isGenerating ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
                      <p className="text-[var(--color-text-primary)] font-roboto">Generating preview...</p>
                    </div>
                  ) : generatedImage ? (
                    showCropper ? (
                      <ReactCrop
                        crop={crop}
                        onChange={setCrop}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                        circularCrop
                      >
                        <img
                          ref={imgRef}
                          crossOrigin="anonymous"
                          src={`${process.env.NEXT_PUBLIC_API_URL}/media/${generatedImage}`}
                          alt="Character Preview"
                          className="w-full h-full object-contain"
                          onLoad={onImageLoad}
                        />
                      </ReactCrop>
                    ) : (
                      <img
                        crossOrigin="anonymous"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/media/${generatedImage}`}
                        alt="Character Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('Image failed to load');
                          e.target.src = '/placeholder-character.png';
                        }}
                      />
                    )
                  ) : (
                    <p className="text-[var(--color-text-primary)] italic font-roboto">
                      Character preview will appear here
                    </p>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={isGenerating || !character.race || !character.class}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating Preview...' : 'Generate Preview'}
                  </button>
                  
                  {generatedImage && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowCropper(!showCropper)}
                        className="btn-secondary"
                      >
                        {showCropper ? 'Cancel Crop' : 'Crop Icon'}
                      </button>
                      
                      {showCropper && (
                        <button
                          type="button"
                          onClick={handleCropComplete}
                          disabled={isSubmitting}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Processing...' : 'Complete Crop'}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {(!character.race || !character.class) && (
                  <p className="text-sm text-[var(--color-text-primary)] opacity-60 mt-2 text-center">
                    Please select a race and class first
                  </p>
                )}
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
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Character...' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 