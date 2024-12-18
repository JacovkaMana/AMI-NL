// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../components/Layout';
// import { useAuth } from '../contexts/AuthContext';
// import { api } from '../utils/api';

// const MESSAGE_TYPES = {
//   SAY: {
//     label: 'Say',
//     prefix: 'says,',
//     icon: '💬',
//     style: 'bg-blue-500'
//   },
//   ACTION: {
//     label: 'Action',
//     prefix: '',
//     icon: '⚔️',
//     style: 'bg-purple-500'
//   },
//   OOC: {
//     label: 'OOC',
//     prefix: '(Out of Character):',
//     icon: '👤',
//     style: 'bg-gray-500'
//   }
// };

// export default function Game() {
//   const router = useRouter();
//   const { character: characterId } = router.query;
//   const { isAuthenticated } = useAuth();
//   const [character, setCharacter] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [players, setPlayers] = useState([]);
//   const [messageType, setMessageType] = useState('SAY');
//   const [showMessageTypes, setShowMessageTypes] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/auth/login');
//       return;
//     }

//     if (!characterId) {
//       router.push('/characters');
//       return;
//     }

//     const fetchCharacter = async () => {
//       try {
//         const response = await api.get(`/api/characters/${characterId}`);
//         setCharacter(response.data);
//         setMessages([{
//           type: 'system',
//           content: `Welcome to the tavern, ${response.data.name}! Other adventurers are gathered here...`,
//           timestamp: new Date().toISOString()
//         }]);

//         setPlayers([
//           {
//             id: 1,
//             character: {
//               name: "Thorin Oakenshield",
//               level: 5,
//               character_class: "Fighter",
//               image_path: null,
//               status: "online"
//             },
//             user: { username: "player1" }
//           },
//           {
//             id: 2,
//             character: {
//               name: "Gandalf the Grey",
//               level: 8,
//               character_class: "Wizard",
//               image_path: null,
//               status: "online"
//             },
//             user: { username: "player2" }
//           }
//         ]);
//       } catch (err) {
//         console.error('Failed to fetch character:', err);
//         router.push('/characters');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCharacter();
//   }, [isAuthenticated, characterId, router]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const newMessage = {
//       type: 'user',
//       messageType,
//       content: inputMessage,
//       timestamp: new Date().toISOString(),
//       character: {
//         name: character.name,
//         image: character.image_path,
//         character_class: character.character_class
//       }
//     };

//     setMessages(prev => [...prev, newMessage]);
//     setInputMessage('');

//     try {
//       const response = {
//         type: 'ai',
//         content: 'The Dungeon Master ponders your action...',
//         timestamp: new Date().toISOString()
//       };
      
//       setTimeout(() => {
//         setMessages(prev => [...prev, response]);
//       }, 1000);
//     } catch (error) {
//       console.error('Failed to get AI response:', error);
//     }
//   };

//   const formatMessage = (message) => {
//     if (message.type !== 'user') return message.content;

//     switch (message.messageType) {
//       case 'SAY':
//         return `"${message.content}"`;
//       case 'ACTION':
//         return `*${message.content}*`;
//       case 'OOC':
//         return `((${message.content}))`;
//       default:
//         return message.content;
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="flex h-[calc(100vh-4rem)]">
//         <div className="w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] p-4">
//           <div className="text-center">
//             <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
//               {character?.image_path ? (
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_API_URL}/media/${character.image_path}`}
//                   alt={character.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-[var(--color-bg-primary)] flex items-center justify-center">
//                   <span className="text-3xl">🦹‍♂️</span>
//                 </div>
//               )}
//             </div>
//             <h2 className="text-lg font-cinzel text-[var(--color-text-primary)]">
//               {character?.name}
//             </h2>
//             <p className="text-sm text-[var(--color-text-secondary)]">
//               Level {character?.level} {character?.character_class}
//             </p>
//           </div>

//           <div className="mt-6 space-y-2">
//             <div className="bg-[var(--color-bg-primary)] p-2 rounded">
//               <div className="text-xs text-[var(--color-text-secondary)]">HP</div>
//               <div className="text-[var(--color-text-primary)]">
//                 {character?.current_hit_points}/{character?.hit_points}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 flex flex-col bg-[var(--color-bg-primary)]">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`
//                   max-w-3xl mx-auto p-4 rounded-lg
//                   ${message.type === 'system' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]' :
//                     message.type === 'user' ? `${MESSAGE_TYPES[message.messageType]?.style || 'bg-[var(--color-accent)]'} text-white` :
//                     'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'}
//                 `}
//               >
//                 {message.type === 'user' && (
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-8 h-8 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
//                       {message.character.image ? (
//                         <img
//                           src={`${process.env.NEXT_PUBLIC_API_URL}/media/${message.character.image}`}
//                           alt={message.character.name}
//                           className="w-full h-full rounded-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-lg">🦹‍♂️</span>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-cinzel">{message.character.name}</div>
//                       <div className="text-xs opacity-75">{message.character.character_class}</div>
//                     </div>
//                   </div>
//                 )}
//                 <div className={message.type === 'system' ? 'italic text-center' : ''}>
//                   {message.type === 'user' ? (
//                     <div className="flex items-start gap-2">
//                       <span>{MESSAGE_TYPES[message.messageType]?.icon}</span>
//                       <span>
//                         {message.messageType === 'SAY' && <span className="opacity-75">{MESSAGE_TYPES[message.messageType].prefix} </span>}
//                         {formatMessage(message)}
//                       </span>
//                     </div>
//                   ) : (
//                     message.content
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-[var(--color-border)] p-4">
//             <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto space-y-2">
//               <div className="flex gap-2">
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setShowMessageTypes(!showMessageTypes)}
//                     className="h-full px-4 bg-[var(--color-bg-secondary)] rounded-lg flex items-center gap-2 hover:bg-[var(--color-bg-hover)]"
//                   >
//                     <span>{MESSAGE_TYPES[messageType].icon}</span>
//                     <span>{MESSAGE_TYPES[messageType].label}</span>
//                   </button>
                  
//                   {showMessageTypes && (
//                     <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--color-bg-secondary)] rounded-lg shadow-lg border border-[var(--color-border)]">
//                       {Object.entries(MESSAGE_TYPES).map(([type, { label, icon }]) => (
//                         <button
//                           key={type}
//                           type="button"
//                           onClick={() => {
//                             setMessageType(type);
//                             setShowMessageTypes(false);
//                           }}
//                           className="w-full px-4 py-2 flex items-center gap-2 hover:bg-[var(--color-bg-hover)] first:rounded-t-lg last:rounded-b-lg"
//                         >
//                           <span>{icon}</span>
//                           <span>{label}</span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
                
//                 <input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   placeholder={`${MESSAGE_TYPES[messageType].label}...`}
//                   className="flex-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
//                 />
//                 <button
//                   type="submit"
//                   className="btn-primary px-6"
//                 >
//                   Send
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <div className="w-64 bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] p-4">
//           <h3 className="text-lg font-cinzel text-[var(--color-text-primary)] mb-4">
//             Players in Session
//           </h3>
//           <div className="space-y-3">
//             {players.map((player) => (
//               <div key={player.id} className="flex items-center gap-3">
//                 <div className="relative">
//                   <div className="w-10 h-10 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
//                     {player.character.image_path ? (
//                       <img
//                         src={`${process.env.NEXT_PUBLIC_API_URL}/media/${player.character.image_path}`}
//                         alt={player.character.name}
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-xl">🦹‍♂️</span>
//                     )}
//                   </div>
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--color-bg-secondary)] 
//                     ${player.character.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
//                 </div>
//                 <div>
//                   <div className="text-sm font-cinzel text-[var(--color-text-primary)]">
//                     {player.character.name}
//                   </div>
//                   <div className="text-xs text-[var(--color-text-secondary)]">
//                     Level {player.character.level} {player.character.character_class}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// } 