import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages, currentUser }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.userId === currentUser.id;

        return (
          <div
            key={index}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] ${
                isOwnMessage
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]'
              } rounded-lg p-3 shadow`}
            >
              {message.character && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-cinzel font-bold text-sm">
                    {message.character.name}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              )}
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList; 