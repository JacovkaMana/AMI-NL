import { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ messages, onSendMessage, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} currentUser={currentUser} />
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[var(--color-border)]">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </>
  );
};

export default ChatWindow; 