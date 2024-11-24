import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ChatLayout from '../../components/Chat/ChatLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function Chat() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return (
    <Layout>
      <ChatLayout>
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)]">
          <div className="text-center">
            <h1 className="text-2xl font-cinzel mb-4">Welcome to Chat</h1>
            <p>Select a room from the sidebar to start chatting</p>
          </div>
        </div>
      </ChatLayout>
    </Layout>
  );
} 