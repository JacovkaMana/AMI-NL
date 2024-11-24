const CharacterContext = ({ characters, selectedCharacter, onSelectCharacter }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-cinzel text-[var(--color-text-primary)] mb-4">
        Your Characters
      </h2>
      <div className="space-y-2">
        {characters.map((character) => (
          <div
            key={character.uid}
            onClick={() => onSelectCharacter(character)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedCharacter?.uid === character.uid
                ? 'bg-[var(--color-accent)] text-white'
                : 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
            }`}
          >
            <div className="font-cinzel font-bold">{character.name}</div>
            <div className="text-sm opacity-75">
              Level {character.level} {character.character_class}
            </div>
          </div>
        ))}
      </div>
      {characters.length === 0 && (
        <p className="text-[var(--color-text-secondary)] text-sm">
          No characters available. Create one to join the chat!
        </p>
      )}
    </div>
  );
};

export default CharacterContext; 