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
      {/* Character Image */}
      {character.image_url && (
        <div className="flex justify-center">
          <img 
            src={character.image_url} 
            alt={character.name}
            className="w-48 h-48 rounded-full object-cover border-4 border-[var(--color-border)]"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info - Updated */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Basic Information</h3>
          <div className="space-y-4">
            {[
              { label: 'Name', value: character.name },
              { label: 'Class', value: `${character.character_class} (Level ${character.level})` },
              { label: 'Race', value: character.race },
              { label: 'Background', value: character.background },
              { label: 'Alignment', value: character.alignment },
              { label: 'Experience', value: character.experience }
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-sm text-[var(--color-text-secondary)]">{label}</label>
                <p className="text-[var(--color-text-primary)] font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Combat Stats - Updated */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Combat Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Armor Class', value: character.armor_class },
              { label: 'Initiative', value: `+${character.initiative}` },
              { label: 'Hit Points', value: `${character.hit_points}/${character.max_hit_points}` },
              { label: 'Speed', value: `${character.speed} ft.` }
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-sm text-[var(--color-text-secondary)]">{label}</label>
                <p className="text-[var(--color-text-primary)] font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Abilities Section - Updated */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
        <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Abilities & Skills</h3>
        <div className="space-y-6">
          {/* Ability Scores */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
              <div key={ability} className="text-center p-4 bg-[var(--color-bg-primary)] rounded-lg">
                <label className="text-sm text-[var(--color-text-secondary)] capitalize">{ability}</label>
                <p className="text-xl text-[var(--color-text-primary)] font-medium">
                  {character[ability]} ({calculateModifier(character[ability]) >= 0 ? '+' : ''}
                  {calculateModifier(character[ability])})
                </p>
              </div>
            ))}
          </div>

          {/* Proficiencies */}
          {character.proficiencies && character.proficiencies.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Proficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {character.proficiencies.map((prof, index) => (
                  <span key={index} className="px-3 py-1 bg-[var(--color-bg-primary)] rounded-full text-sm">
                    {prof}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {character.skills && Object.keys(character.skills).length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Skills</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(character.skills).map(([skill, value]) => (
                  <div key={skill} className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)] capitalize">{skill}</span>
                    <span className="text-[var(--color-text-primary)]">+{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-6">
      {/* Weapons */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
        <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Weapons</h3>
        {character.weapons && character.weapons.length > 0 ? (
          <ul className="space-y-2">
            {character.weapons.map((weapon, index) => (
              <li key={index} className="text-[var(--color-text-primary)]">{weapon}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-text-secondary)]">No weapons equipped</p>
        )}
      </div>

      {/* Armor */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
        <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Armor</h3>
        {character.armor && character.armor.length > 0 ? (
          <ul className="space-y-2">
            {character.armor.map((item, index) => (
              <li key={index} className="text-[var(--color-text-primary)]">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-text-secondary)]">No armor equipped</p>
        )}
      </div>

      {/* Equipment */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
        <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Other Equipment</h3>
        {character.equipment && character.equipment.length > 0 ? (
          <ul className="space-y-2">
            {character.equipment.map((item, index) => (
              <li key={index} className="text-[var(--color-text-primary)]">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-text-secondary)]">No additional equipment</p>
        )}
      </div>
    </div>
  );

  const renderSpells = () => (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)]">
      <h3 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-4">Spells</h3>
      {character.spellcasting_ability ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Spellcasting Ability</h4>
            <p className="text-[var(--color-text-primary)] capitalize">{character.spellcasting_ability}</p>
          </div>

          {character.spells_known && character.spells_known.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Known Spells</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {character.spells_known.map((spell, index) => (
                  <div key={index} className="text-[var(--color-text-primary)]">{spell}</div>
                ))}
              </div>
            </div>
          )}

          {character.spell_slots && Object.keys(character.spell_slots).length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Spell Slots</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(character.spell_slots).map(([level, slots]) => (
                  <div key={level} className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Level {level}</span>
                    <span className="text-[var(--color-text-primary)]">{slots}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[var(--color-text-secondary)]">This character cannot cast spells</p>
      )}
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