import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useCharacter } from '../../contexts/CharacterContext';
import { api } from '../../utils/api';

// Define tile types with their properties
const TILE_TYPES = {
  WOOD_FLOOR: {
    className: 'bg-amber-800/80',
    label: 'Wood Floor'
  },
  WATER: {
    className: 'bg-blue-500/50',
    label: 'Water'
  },
  WALL: {
    className: 'bg-stone-800',
    label: 'Wall'
  },
  CRATE: {
    className: 'bg-amber-600',
    label: 'Crate'
  }
};

// Mock entities for the map
const MOCK_ENTITIES = [
  {
    id: 'goblin-1',
    name: 'Goblin Scout',
    type: 'enemy',
    position: { x: 5, y: 5 },
    image: '🧟',
    stats: {
      hp: 7,
      ac: 15,
      initiative: 14
    }
  },
  {
    id: 'skeleton-1',
    name: 'Skeleton Archer',
    type: 'enemy',
    position: { x: 10, y: 8 },
    image: '💀',
    stats: {
      hp: 13,
      ac: 13,
      initiative: 16
    }
  },
  {
    id: 'chest-1',
    name: 'Treasure Chest',
    type: 'object',
    position: { x: 7, y: 15 },
    image: '📦',
    interaction: 'loot'
  }
];

// Mock data for the ship map
const MOCK_SHIP_MAP = {
  width: 15,
  height: 25,
  tiles: [],
  entities: MOCK_ENTITIES
};

export default function MapPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { character, setCharacter } = useCharacter();
  const [map, setMap] = useState(null);
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Initialize the ship map and turn order
    const initializeMap = () => {
      const tiles = Array(MOCK_SHIP_MAP.height).fill().map((_, y) => 
        Array(MOCK_SHIP_MAP.width).fill().map((_, x) => {
          // Create ship hull shape
          const isEdge = x === 0 || x === MOCK_SHIP_MAP.width - 1 || 
                        y === 0 || y === MOCK_SHIP_MAP.height - 1;
          const isCenterHole = x === Math.floor(MOCK_SHIP_MAP.width / 2) && 
                              y === Math.floor(MOCK_SHIP_MAP.height / 2);
          const isRandomCrate = Math.random() < 0.1 && !isEdge && !isCenterHole;

          return {
            type: isEdge ? 'WALL' : 
                  isCenterHole ? 'WATER' :
                  isRandomCrate ? 'CRATE' : 'WOOD_FLOOR',
            x,
            y
          };
        })
      );

      setMap({
        ...MOCK_SHIP_MAP,
        tiles,
        playerPosition: { x: 7, y: 20 } // Starting position
      });

      // Initialize turn order with player and entities
      const combatants = [
        ...MOCK_ENTITIES.filter(e => e.type === 'enemy'),
      ];

      if (character) {
        combatants.push({
          id: 'player',
          name: character.name,
          type: 'player',
          image: character.image_path,
          stats: {
            initiative: character.initiative,
            hp: character.hit_points,
            ac: character.armor_class
          }
        });
      }

      // Sort by initiative
      const sortedTurnOrder = combatants.sort((a, b) => 
        (b.stats?.initiative || 0) - (a.stats?.initiative || 0)
      );

      setTurnOrder(sortedTurnOrder);
    };

    if (!character) {
      const fetchCharacter = async () => {
        try {
          const response = await api.get('/api/characters/current');
          setCharacter(response.data);
        } catch (err) {
          console.error('Failed to fetch character:', err);
          router.push('/characters');
        }
      };
      fetchCharacter();
    }

    initializeMap();
  }, [isAuthenticated, character, setCharacter, router]);

  const handleNextTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % turnOrder.length);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapPosition.x,
      y: e.clientY - mapPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setMapPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderTurnOrderBar = () => {
    return (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {turnOrder.map((entity, index) => {
          const isCurrentTurn = index === currentTurn;
          const isPlayer = entity.type === 'player';
          
          return (
            <div
              key={entity.id}
              className={`
                relative w-16 h-16 rounded-lg transition-all duration-300
                ${isCurrentTurn ? 'scale-110 z-10' : 'opacity-80'}
                ${index > currentTurn ? 'translate-y-2' : '-translate-y-2'}
              `}
            >
              {/* Turn indicator arrow */}
              {isCurrentTurn && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-yellow-500 text-xl">
                  ▶
                </div>
              )}

              {/* Portrait/Icon */}
              <div
                className={`
                  w-full h-full rounded-lg overflow-hidden border-2 shadow-lg
                  ${isCurrentTurn ? 'border-yellow-500' : 'border-gray-600'}
                  ${isPlayer ? 'bg-blue-900' : 'bg-red-900'}
                `}
              >
                {isPlayer && entity.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/media/${entity.image}`}
                    alt={entity.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {entity.image || '👤'}
                  </div>
                )}
              </div>

              {/* Initiative badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 border border-gray-600 flex items-center justify-center text-xs text-white">
                {entity.stats.initiative}
              </div>

              {/* HP bar */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-1 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ 
                    width: `${(entity.stats.hp / (isPlayer ? character.hit_points : entity.stats.hp)) * 100}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderEntity = (entity) => {
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center group cursor-pointer"
        title={entity.name}
      >
        <div className="relative">
          {/* Entity Image/Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-800/60 border-2 border-red-500 shadow-lg flex items-center justify-center text-2xl">
            {entity.image}
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900/95 rounded-lg shadow-xl text-xs text-white">
            <div className="font-bold mb-1">{entity.name}</div>
            {entity.stats && (
              <div className="grid grid-cols-2 gap-1">
                <div>HP: {entity.stats.hp}</div>
                <div>AC: {entity.stats.ac}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTile = (tile, entities) => {
    const entity = entities?.find(e => e.position.x === tile.x && e.position.y === tile.y);
    const isPlayerPosition = map.playerPosition.x === tile.x && map.playerPosition.y === tile.y;

    return (
      <div
        key={`${tile.x}-${tile.y}`}
        className={`
          w-12 h-12 border border-black/20 relative select-none
          ${TILE_TYPES[tile.type].className}
          transition-all duration-200
        `}
      >
        {/* Player Character */}
        {isPlayerPosition && character && (
          <div className="absolute inset-0 flex items-center justify-center group">
            <div className="relative">
              {character.image_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/media/${character.image_path}`}
                  alt={character.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
                  {character.name[0]}
                </div>
              )}
              
              {/* Player Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900/95 rounded-lg shadow-xl text-xs text-white">
                <div className="font-bold mb-1">{character.name}</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>Level {character.level}</div>
                  <div>{character.character_class}</div>
                  <div>HP: {character.hit_points}</div>
                  <div>AC: {character.armor_class}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Entities */}
        {entity && renderEntity(entity)}
      </div>
    );
  };

  if (!map || !character) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8">
        <div className="mb-4">
          <button onClick={handleNextTurn} className="btn-secondary">Next Turn</button>
        </div>
        
        <div className="flex gap-8">
          {/* Turn Order Bar */}
          <div className="flex flex-col gap-2 py-4">
            <h3 className="text-white text-center mb-2 font-bold">Turn Order</h3>
            {turnOrder.map((entity, index) => {
              const isCurrentTurn = index === currentTurn;
              const isPlayer = entity.type === 'player';
              
              return (
                <div
                  key={entity.id}
                  className={`
                    relative w-16 h-16 rounded-lg transition-all duration-300
                    ${isCurrentTurn ? 'scale-110 z-10' : 'opacity-80'}
                  `}
                >
                  {/* Turn indicator arrow */}
                  {isCurrentTurn && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-yellow-500 text-xl">
                      ▶
                    </div>
                  )}

                  {/* Portrait/Icon */}
                  <div
                    className={`
                      w-full h-full rounded-lg overflow-hidden border-2 shadow-lg
                      ${isCurrentTurn ? 'border-yellow-500' : 'border-gray-600'}
                      ${isPlayer ? 'bg-blue-900' : 'bg-red-900'}
                    `}
                  >
                    {isPlayer && entity.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/media/${entity.image}`}
                        alt={entity.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {entity.image || '👤'}
                      </div>
                    )}
                  </div>

                  {/* Initiative badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 border border-gray-600 flex items-center justify-center text-xs text-white">
                    {entity.stats.initiative}
                  </div>

                  {/* HP bar */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ 
                        width: `${(entity.stats.hp / (isPlayer ? character.hit_points : entity.stats.hp)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Area */}
          <div className="relative w-[800px] h-[800px] rounded-lg bg-blue-900/20 overflow-hidden">
            <div 
              className="absolute select-none cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {map.tiles.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((tile) => renderTile(tile, map.entities))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 