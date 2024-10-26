import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

const Home = () => {
    const router = useRouter();

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                <h1 className="mb-8">Welcome to D&D Character Creation & Chat</h1>
                <p className="max-w-2xl mb-12 text-lg">
                    Create your character, join chat rooms, and embark on epic adventures with fellow players.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="btn-primary"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => router.push('/auth/register')}
                        className="btn-secondary"
                    >
                        Register
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
