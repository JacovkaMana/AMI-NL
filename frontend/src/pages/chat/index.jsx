import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchChatRooms = async () => {
      try {
        const response = await api.get('/api/chat-rooms/');
        setChatRooms(response.data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [isAuthenticated, router]);

  const navigateToRoom = (roomId) => {
    router.push(`/chat-room/${roomId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-[var(--color-text-primary)]">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-cinzel text-[var(--color-text-primary)] mb-8">Chat Rooms</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigateToRoom(room.id)}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-2">
                {room.name}
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                {room.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 