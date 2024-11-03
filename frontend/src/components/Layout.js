import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const [theme, setTheme] = useState('light');
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <nav className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-cinzel text-[var(--color-text-primary)]">D&D Companion</h1>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)]"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </nav>
            <main className="container mx-auto px-4 bg-[var(--color-bg-primary)]">
                {children}
            </main>
        </div>
    );
};

export default Layout;
