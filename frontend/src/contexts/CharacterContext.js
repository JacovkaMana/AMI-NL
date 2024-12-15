import { createContext, useContext, useState } from 'react';

const CharacterContext = createContext();

export const useCharacter = () => useContext(CharacterContext);

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(null);

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}; 