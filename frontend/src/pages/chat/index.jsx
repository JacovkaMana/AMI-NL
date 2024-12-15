import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ChatLayout from '../../components/Chat/ChatLayout';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

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
      <div className="p-4">
        <Link href="/game/map">
          <a className="btn-primary">Go to DnD Map</a>
        </Link>
      </div>
    </Layout>
  );
} 