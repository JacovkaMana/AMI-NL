import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/characters/me', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchCharacters();
    }
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[80vh]">
          <p className="text-[var(--color-text-primary)]">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-cinzel text-[var(--color-text-primary)]">
            Your Characters
          </h1>
          <button
            onClick={() => router.push('/character-creation')}
            className="btn-primary"
          >
            Create New Character
          </button>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
            <p className="text-[var(--color-text-secondary)] mb-4">You haven't created any characters yet.</p>
            <button
              onClick={() => router.push('/character-creation')}
              className="btn-primary"
            >
              Create Your First Character
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
                onClick={() => router.push(`/characters/${character.id}`)}
              >
                <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-2">
                  {character.name}
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  Level {character.level} {character.race} {character.character_class}
                </p>
                <p className="text-[var(--color-text-secondary)] text-sm italic">
                  {character.background}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Characters;