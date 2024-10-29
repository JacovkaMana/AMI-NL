import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const Home = () => {
    const router = useRouter();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                <h1 className="mb-8">Welcome to D&D Character Creation & Chat</h1>
                <p className="max-w-2xl mb-12 text-lg">
                    Create your character, join chat rooms, and embark on epic adventures with fellow players.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="btn-primary"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="btn-secondary"
                    >
                        Register
                    </button>
                </div>
            </div>
            <LoginModal isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
            <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={() => setIsRegisterModalOpen(false)} />
        </Layout>
    );
};

export default Home;