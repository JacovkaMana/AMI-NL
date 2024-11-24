import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ChatLayout from '../../../components/Chat/ChatLayout';
import { useAuth } from '../../../contexts/AuthContext';

export default function ChatRoom() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');

  // Mock messages data
  const [messages] = useState([
    { id: 1, user: 'Gandalf', content: 'You shall not pass!', timestamp: '10:30 AM' },
    { id: 2, user: 'Frodo', content: 'What about second breakfast?', timestamp: '10:32 AM' },
    { id: 3, user: 'Aragorn', content: 'And my sword!', timestamp: '10:35 AM' },
  ]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <Layout>
      <ChatLayout>
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-lg font-cinzel text-[var(--color-text-primary)]">
              Room #{id}
            </h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-[var(--color-text-primary)]">{msg.user}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{msg.timestamp}</span>
                </div>
                <p className="text-[var(--color-text-primary)]">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--color-border)]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-opacity-90"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </ChatLayout>
    </Layout>
  );
} 