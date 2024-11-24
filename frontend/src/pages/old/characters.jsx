// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../components/Layout';
// import { useAuth } from '../contexts/AuthContext';
// import { api } from '../utils/api';

// export default function Characters() {
//   const [characters, setCharacters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const { isAuthenticated, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       router.push('/auth/login');
//       return;
//     }

//     const fetchCharacters = async () => {
//       try {
//         const response = await api.get('/api/characters/me');
//         console.log('Characters response:', response.data);
//         setCharacters(response.data);
//       } catch (err) {
//         console.error('Error fetching characters:', err);
//         setError('Failed to load characters. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) {
//       fetchCharacters();
//     }
//   }, [isAuthenticated, authLoading, router]);

//   const handleCharacterClick = (characterId) => {
//     router.push(`/character/${characterId}`);
//   };

//   const handleCreateCharacter = () => {
//     router.push('/character-creation');
//   };

//   if (authLoading || loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <div className="text-[var(--color-text-primary)]">Loading...</div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <div className="text-red-500">{error}</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-cinzel text-[var(--color-text-primary)]">My Characters</h1>
//           <button
//             onClick={handleCreateCharacter}
//             className="btn-primary"
//           >
//             Create New Character
//           </button>
//         </div>

//         {characters.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-[var(--color-text-primary)]">No characters found. Create your first character!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {characters.map((character) => (
//               <div
//                 key={character.uid}
//                 className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => handleCharacterClick(character.uid)}
//               >
//                 <h2 className="text-xl font-cinzel text-[var(--color-text-primary)] mb-2">{character.name}</h2>
//                 <p className="text-[var(--color-text-secondary)] mb-2">
//                   Level {character.level} {character.character_class}
//                 </p>
//                 <p className="text-[var(--color-text-secondary)]">
//                   {character.race} • {character.background}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }