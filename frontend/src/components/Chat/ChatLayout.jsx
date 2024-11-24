import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaChevronLeft, FaChevronRight, FaUsers, FaDungeon } from 'react-icons/fa';

const ChatLayout = ({ children }) => {
  const router = useRouter();
  const [isRoomsSidebarCollapsed, setIsRoomsSidebarCollapsed] = useState(false);
  const [isFriendsSidebarCollapsed, setIsFriendsSidebarCollapsed] = useState(false);

  // Mock data for rooms and friends
  const rooms = [
    { id: 1, name: 'Tavern', unreadCount: 3, icon: '🍺' },
    { id: 2, name: 'Adventurers Guild', unreadCount: 0, icon: '⚔️' },
    { id: 3, name: 'Quest Board', unreadCount: 5, icon: '📜' },
  ];

  const friends = [
    { id: 1, name: 'Gandalf', status: 'online', avatar: '🧙‍♂️' },
    { id: 2, name: 'Aragorn', status: 'offline', avatar: '👑' },
    { id: 3, name: 'Legolas', status: 'idle', avatar: '🏹' },
    { id: 4, name: 'Gimli', status: 'online', avatar: '🪓' },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg-primary)]">
      {/* Rooms Sidebar */}
      <div 
        className={`${
          isRoomsSidebarCollapsed ? 'w-16' : 'w-64'
        } bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[var(--color-border)]">
          {!isRoomsSidebarCollapsed && (
            <h2 className="text-lg font-cinzel text-[var(--color-text-primary)]">Rooms</h2>
          )}
          <button
            onClick={() => setIsRoomsSidebarCollapsed(!isRoomsSidebarCollapsed)}
            className="p-2 rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
          >
            {isRoomsSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="p-2 space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => router.push(`/chat/rooms/${room.id}`)}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{room.icon}</span>
                  {!isRoomsSidebarCollapsed && <span># {room.name}</span>}
                </div>
                {room.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {room.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Friends Sidebar */}
      <div 
        className={`${
          isFriendsSidebarCollapsed ? 'w-16' : 'w-64'
        } bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] flex flex-col transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[var(--color-border)]">
          {!isFriendsSidebarCollapsed && (
            <h2 className="text-lg font-cinzel text-[var(--color-text-primary)]">Friends</h2>
          )}
          <button
            onClick={() => setIsFriendsSidebarCollapsed(!isFriendsSidebarCollapsed)}
            className="p-2 rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
          >
            {isFriendsSidebarCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="p-2 space-y-1">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center space-x-2 p-2 rounded hover:bg-[var(--color-bg-hover)] cursor-pointer"
              >
                <div className="relative">
                  <span className="text-xl">{friend.avatar}</span>
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-bg-secondary)] ${
                      friend.status === 'online'
                        ? 'bg-green-500'
                        : friend.status === 'idle'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  />
                </div>
                {!isFriendsSidebarCollapsed && (
                  <span className="text-[var(--color-text-primary)]">{friend.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout; 