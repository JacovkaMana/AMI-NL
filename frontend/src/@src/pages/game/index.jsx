import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../utils/api';

const MESSAGE_TYPES = {
  SAY: {
    label: 'Say',
    prefix: 'says,',
    icon: '💬',
    format: (content) => `"${content}"`,
    style: 'normal'
  },
  ACTION: {
    label: 'Action',
    prefix: '',
    icon: '⚔️',
    format: (content) => `*${content}*`,
    style: 'italic'
  },
  OOC: {
    label: 'OOC',
    prefix: '(Out of Character):',
    icon: '👤',
    format: (content) => `((${content}))`,
    style: 'opacity-75'
  }
};

const LOCATION = {
  name: "The Prancing Pony",
  description: "A well-known inn and tavern in the village of Bree",
  image_url: "/images/tavern.jpg",
  ambiance: "Warm firelight flickers across wooden beams as the sounds of laughter and clinking mugs fill the air"
};

// Add character colors
const CHARACTER_COLORS = {
  'Fighter': 'text-red-400',
  'Wizard': 'text-blue-400',
  'Rogue': 'text-green-400',
  'Cleric': 'text-yellow-400',
  'default': 'text-purple-400'
};

export default function GamePage() {
  // ... existing state declarations ...

  const getCharacterColor = (characterClass) => {
    return CHARACTER_COLORS[characterClass] || CHARACTER_COLORS.default;
  };

  const formatMessage = (message) => {
    if (message.type !== 'user') return message.content;
    return MESSAGE_TYPES[message.messageType].format(message.content);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Character Info */}
        <div className="w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] p-4">
          {/* ... existing character sidebar code ... */}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[var(--color-bg-primary)]">
          {/* Location Header */}
          <div className="border-b border-[var(--color-border)]">
            <div className="relative h-48">
              <img
                src={LOCATION.image_url}
                alt={LOCATION.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h1 className="text-2xl font-cinzel font-bold">{LOCATION.name}</h1>
                <p className="text-sm opacity-90">{LOCATION.description}</p>
              </div>
            </div>
            <div className="p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] italic text-sm">
              {LOCATION.ambiance}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`
                  max-w-3xl mx-auto p-4 rounded-lg
                  ${message.type === 'system' 
                    ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] italic' 
                    : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)]'}
                `}
              >
                {message.type === 'user' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
                      {message.character.image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/media/${message.character.image}`}
                          alt={message.character.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">🦹‍♂️</span>
                      )}
                    </div>
                    <div>
                      <div className={`font-cinzel ${getCharacterColor(message.character.character_class)}`}>
                        {message.character.name}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {message.character.character_class}
                      </div>
                    </div>
                  </div>
                )}
                <div 
                  className={`
                    ${message.type === 'system' ? 'text-center' : 'text-[var(--color-text-primary)]'}
                    ${message.type === 'user' ? MESSAGE_TYPES[message.messageType].style : ''}
                  `}
                >
                  {message.type === 'user' ? (
                    <div className="flex items-start gap-2">
                      <span>{MESSAGE_TYPES[message.messageType].icon}</span>
                      <span className={getCharacterColor(message.character.character_class)}>
                        {message.messageType === 'SAY' && 
                          <span className="text-[var(--color-text-secondary)]">
                            {MESSAGE_TYPES[message.messageType].prefix}{' '}
                          </span>
                        }
                        {formatMessage(message)}
                      </span>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--color-border)] p-4">
            {/* ... existing input form code ... */}
          </div>
        </div>

        {/* Right Sidebar - Players List */}
        <div className="w-64 bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] p-4">
          {/* ... existing players list code ... */}
        </div>
      </div>
    </Layout>
  );
}