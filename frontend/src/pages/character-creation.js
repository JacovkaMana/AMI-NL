import React, { useState } from 'react';
import Layout from '../components/Layout';

const CharacterCreation = () => {
    const [character, setCharacter] = useState({ name: '', race: '', class: '' });

    const handleChange = (e) => {
        setCharacter({ ...character, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle character creation
        console.log('Character Created:', character);
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto">
                <h1 className="text-center mb-8">Character Creation</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Character Name"
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="race"
                        placeholder="Race"
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="class"
                        placeholder="Class"
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <button type="submit" className="btn-primary w-full">
                        Create Character
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default CharacterCreation;
