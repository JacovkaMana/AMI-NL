import React, { useState } from 'react';

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
        <div style={{ padding: '1rem' }}>
            <h2>Create Your Character</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Character Name" onChange={handleChange} required />
                <input type="text" name="race" placeholder="Race" onChange={handleChange} required />
                <input type="text" name="class" placeholder="Class" onChange={handleChange} required />
                <button type="submit" style={{ backgroundColor: '#FFD700', color: '#2F4F4F' }}>Create Character</button>
            </form>
        </div>
    );
};

export default CharacterCreation;
