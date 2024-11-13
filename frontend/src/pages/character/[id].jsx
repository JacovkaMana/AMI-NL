import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

const CharacterSheet = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, token } = useAuth();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchCharacter = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/api/characters/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharacter(response.data);
      } catch (err) {
        setError('Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, isAuthenticated, token, router]);

  const handleDescriptionEdit = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      try {
        await api.patch(`/api/characters/${id}`, 
          { description: editedDesc },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setCharacter(prev => ({
          ...prev,
          description: editedDesc
        }));
        setIsEditingDesc(false);
      } catch (err) {
        console.error('Failed to update description:', err);
      }
    }
  };

  if (loading) return <Layout><div className="container mx-auto p-4">Loading...</div></Layout>;
  if (error) return <Layout><div className="container mx-auto p-4 text-red-500">{error}</div></Layout>;
  if (!character) return <Layout><div className="container mx-auto p-4">Character not found</div></Layout>;

  const calculateModifier = (value) => {
    const modifier = Math.floor((value - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : modifier;
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Character Image */}
          <div className="md:col-span-1">
            {character.image_path && (
              <img
                src={`http://localhost:8000/media/${character.image_path}`}
                alt={character.name}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            )}
          </div>
          
          {/* Basic Info */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">{character.name}</h1>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[var(--color-text-secondary)]">Level 1 {character.race} {character.character_class}</p>
                <p className="text-[var(--color-text-secondary)]">{character.background}</p>
                <p className="text-[var(--color-text-secondary)]">{character.alignment}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)]">Size: {character.size}</p>
                <p className="text-[var(--color-text-secondary)]">Speed: {character.speed} ft.</p>
              </div>
            </div>
            <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
              <h3 className="font-bold mb-2 flex justify-between items-center">
                Description
                <button 
                  onClick={() => {
                    setIsEditingDesc(true);
                    setEditedDesc(character.description);
                  }}
                  className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                >
                  {!isEditingDesc && 'Edit'}
                </button>
              </h3>
              {isEditingDesc ? (
                <textarea
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  onKeyDown={handleDescriptionEdit}
                  onBlur={() => {
                    setIsEditingDesc(false);
                    setEditedDesc(character.description);
                  }}
                  className="w-full h-32 p-2 text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] 
                    border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-[var(--color-accent)]"
                  placeholder="Enter character description..."
                  autoFocus
                />
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">{character.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Ability Scores */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ability Scores</h2>
            <div className="grid grid-cols-2 gap-4">
              {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
                <div key={ability} className="text-center p-2 bg-[var(--color-bg-primary)] rounded">
                  <div className="text-sm uppercase">{ability}</div>
                  <div className="text-xl font-bold">{character[ability]}</div>
                  <div className="text-sm">{calculateModifier(character[ability])}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Combat</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Armor Class</span>
                <span className="font-bold">{character.armor_class}</span>
              </div>
              <div className="flex justify-between">
                <span>Initiative</span>
                <span className="font-bold">{character.initiative}</span>
              </div>
              <div className="flex justify-between">
                <span>Hit Points</span>
                <span className="font-bold">{character.hit_points}</span>
              </div>
              <div className="flex justify-between">
                <span>Hit Dice</span>
                <span className="font-bold">{character.hit_dice}</span>
              </div>
            </div>
          </div>

          {/* Saving Throws */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Saving Throws</h2>
            <div className="space-y-2">
              {Object.entries(character.saving_throws).map(([ability, proficient]) => (
                <div key={ability} className="flex justify-between">
                  <span className="capitalize">{ability}</span>
                  <span className={`${proficient ? 'text-green-500' : ''}`}>
                    {calculateModifier(character[ability])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <div className="space-y-1 text-sm">
              {Object.entries(character.skills).map(([skill, proficient]) => (
                <div key={skill} className="flex justify-between">
                  <span className="capitalize">{skill.replace('-', ' ')}</span>
                  <span className={`${proficient ? 'text-green-500' : ''}`}>
                    {calculateModifier(character[skill.includes('strength') ? 'strength' :
                      skill.includes('dexterity') ? 'dexterity' :
                      skill.includes('constitution') ? 'constitution' :
                      skill.includes('intelligence') ? 'intelligence' :
                      skill.includes('wisdom') ? 'wisdom' : 'charisma'])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/characters')}
            className="btn-secondary"
          >
            Back to Characters
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CharacterSheet; 