import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

export default function Game() {
  const router = useRouter();
  const { character: characterId } = router.query;
  const { isAuthenticated } = useAuth();
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!characterId) {
      router.push('/characters');
      return;
    }

    const fetchCharacter = async () => {
      try {
        const response = await api.get(`/api/characters/${characterId}`);
        setCharacter(response.data);
        // Add initial game message
        setMessages([{
          type: 'system',
          content: `Welcome, ${response.data.name}! Your adventure begins...`,
          timestamp: new Date().toISOString()
        }]);
      } catch (err) {
        console.error('Failed to fetch character:', err);
        router.push('/characters');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [isAuthenticated, characterId, router]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      character: {
        name: character.name,
        image: character.image_path
      }
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Here you would typically send the message to your backend
    // and get an AI response
    try {
      // Simulated AI response - replace with actual API call
      const response = {
        type: 'ai',
        content: 'The dungeon master acknowledges your action...',
        timestamp: new Date().toISOString()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
      }, 1000);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  if (loading) {
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
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Character Info Sidebar */}
        <div className="w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] p-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
              {character?.image_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/media/${character.image_path}`}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-bg-primary)] flex items-center justify-center">
                  <span className="text-3xl">🦹‍♂️</span>
                </div>
              )}
            </div>
            <h2 className="text-lg font-cinzel text-[var(--color-text-primary)]">
              {character?.name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Level {character?.level} {character?.character_class}
            </p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[var(--color-bg-primary)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`
                  max-w-3xl mx-auto p-4 rounded-lg
                  ${message.type === 'system' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]' :
                    message.type === 'user' ? 'bg-[var(--color-accent)] text-white ml-auto' :
                    'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'}
                `}
              >
                {message.content}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--color-border)] p-4">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="What would you like to do?"
                className="flex-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              <button
                type="submit"
                className="btn-primary px-6"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 