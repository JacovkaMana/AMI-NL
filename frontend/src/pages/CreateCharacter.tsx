import { useNavigate } from 'react-router-dom';

function CreateCharacter() {
  const navigate = useNavigate();
  
  // ... other code remains the same

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });

      if (response.ok) {
        // After successful creation, navigate to Characters page
        navigate('/characters');
      } else {
        // ... error handling remains the same
      }
    } catch (error) {
      // ... error handling remains the same
    }
  };

  // ... rest of the component remains the same
} 