import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/characters');
    }
  }, [isAuthenticated, router]);

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-4xl font-cinzel text-[var(--color-text-primary)] mb-8">
          Welcome to D&D Character Creator
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Create and manage your D&D characters with ease
        </p>
        {!isAuthenticated && (
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="btn-secondary px-8 py-3"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/auth/register')}
              className="btn-primary px-8 py-3"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}