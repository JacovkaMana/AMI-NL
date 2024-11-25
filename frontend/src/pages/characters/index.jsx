import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function CharacterSelect() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchCharacters = async () => {
      try {
        const response = await api.get('/api/characters/me');
        setCharacters(response.data);
      } catch (err) {
        setError('Failed to load characters');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCharacters();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleEnterGame = () => {
    if (selectedCharacter) {
      router.push(`/game?character=${selectedCharacter.uid}`);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--color-bg-primary)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-cinzel text-center text-[var(--color-text-primary)] mb-8">
            Select Your Character
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {characters.map((character) => (
              <div
                key={character.uid}
                onClick={() => handleCharacterSelect(character)}
                className={`
                  relative cursor-pointer transition-all duration-300
                  ${selectedCharacter?.uid === character.uid 
                    ? 'ring-4 ring-[var(--color-accent)] scale-105' 
                    : 'hover:scale-102'}
                `}
              >
                <div className="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden shadow-lg">
                  {character.image_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/media/${character.image_path}`}
                      alt={character.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[var(--color-bg-primary)] flex items-center justify-center">
                      <span className="text-6xl">🦹‍♂️</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-cinzel text-[var(--color-text-primary)]">
                      {character.name}
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                      Level {character.level} {character.character_class}
                    </p>
                    <p className="text-[var(--color-text-secondary)]">
                      {character.race} • {character.background}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Character Card */}
            <div
              onClick={() => router.push('/characters/create')}
              className="cursor-pointer transition-all duration-300 hover:scale-102"
            >
              <div className="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-[var(--color-border)] h-full flex flex-col items-center justify-center p-8">
                <span className="text-6xl mb-4">➕</span>
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)]">
                  Create New Character
                </h2>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleEnterGame}
              disabled={!selectedCharacter}
              className={`
                btn-primary px-8 py-4 text-lg
                ${!selectedCharacter ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              Enter Game
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 