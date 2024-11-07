import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

const CharacterSetup = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, token } = useAuth();
  const [character, setCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchCharacter = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/api/characters/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          console.log('Character data:', response.data);
          setCharacter(response.data);
        } else {
          setError('Character not found');
        }
      } catch (err) {
        console.error('Error fetching character:', err);
        setError('Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, isAuthenticated, token, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-[var(--color-text-primary)]">Loading character...</div>
        </div>
      </Layout>
    );
  }

  if (error || !character) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500">{error || 'Character not found'}</div>
        </div>
      </Layout>
    );
  }

  const calculateModifier = (value) => Math.floor((value - 10) / 2);

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Character Basic Info */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Name</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.name}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Class</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.character_class}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Race</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.race}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Background</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.background}</p>
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Combat Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Armor Class</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.armor_class}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Initiative</label>
              <p className="text-[var(--color-text-primary)] font-medium">+{character.initiative}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Hit Points</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.hit_points}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Speed</label>
              <p className="text-[var(--color-text-primary)] font-medium">{character.speed} ft.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
        <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Ability Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
            <div key={ability} className="text-center">
              <label className="text-sm text-[var(--color-text-secondary)] capitalize">{ability}</label>
              <p className="text-xl text-[var(--color-text-primary)] font-medium">
                {character[ability]} ({calculateModifier(character[ability]) >= 0 ? '+' : ''}
                {calculateModifier(character[ability])})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
      <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Equipment</h3>
      <p className="text-[var(--color-text-secondary)]">Equipment management coming soon...</p>
    </div>
  );

  const renderSpells = () => (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
      <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Spells</h3>
      <p className="text-[var(--color-text-secondary)]">Spell management coming soon...</p>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-cinzel text-[var(--color-text-primary)]">{character.name}</h1>
          <button
            onClick={() => router.push('/characters')}
            className="btn-secondary"
          >
            Back to Characters
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-[var(--color-border)]">
          {['general', 'equipment', 'spells'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'general' && renderGeneralInfo()}
          {activeTab === 'equipment' && renderEquipment()}
          {activeTab === 'spells' && renderSpells()}
        </div>
      </div>
    </Layout>
  );
};

export default CharacterSetup; 