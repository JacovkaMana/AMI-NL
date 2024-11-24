import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function ChatRoom() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (id) {
      const fetchRoomData = async () => {
        try {
          const roomResponse = await api.get(`/api/chat-rooms/${id}`);
          setRoom(roomResponse.data);
          
          const messagesResponse = await api.get(`/api/chat-rooms/${id}/messages`);
          setMessages(messagesResponse.data);
        } catch (error) {
          console.error('Error fetching room data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRoomData();
    }
  }, [id, isAuthenticated, router]);

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
        <h1 className="text-3xl font-cinzel text-[var(--color-text-primary)] mb-8">
          {room?.name}
        </h1>
        
        <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] p-6">
          {/* Chat messages will be rendered here */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={message.avatar || '/default-avatar.png'}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-cinzel text-[var(--color-text-primary)]">
                    {message.sender_name}
                  </p>
                  <p className="text-[var(--color-text-secondary)]">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 