import React from 'react';
import { useHistory } from 'react-router-dom';

const LandingPage = () => {
    const history = useHistory();

    const navigateToCharacterCreation = () => {
        history.push('/character-creation');
    };

    const navigateToChatRoom = () => {
        history.push('/chat-room');
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#F5F5DC' }}>
            <h1 style={{ color: '#2E3A24' }}>Welcome to the D&D Character Creation and Chat Room</h1>
            <p style={{ color: '#2F4F4F' }}>Create your character and join the adventure!</p>
            <button onClick={navigateToCharacterCreation} style={{ margin: '1rem', backgroundColor: '#FFD700', color: '#2F4F4F' }}>
                Go to Character Creation
            </button>
            <button onClick={navigateToChatRoom} style={{ margin: '1rem', backgroundColor: '#2E3A24', color: 'white' }}>
                Go to Chat Room
            </button>
        </div>
    );
};

export default LandingPage;
