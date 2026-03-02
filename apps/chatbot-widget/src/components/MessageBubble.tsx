import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  botAvatar?: string;
  botName?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  botAvatar,
  botName = 'Resolver Assistant',
}) => {
  const isUser = message.role === 'user';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Convertir markdown simple a HTML (versión básica)
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div
      className={`
        flex gap-3 mb-4 animate-slide-up
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          ${isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
          }
        `}
      >
        {isUser ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ) : botAvatar ? (
          <img src={botAvatar} alt={botName} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span>R</span>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender Name */}
        {!isUser && (
          <span className="text-xs text-gray-500 mb-1 ml-1">{botName}</span>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-blue-500 text-white rounded-tr-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
            }
          `}
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />

        {/* Timestamp & Model Info */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          
          {!isUser && message.metadata?.model && (
            <span className="text-[10px] text-gray-300">
              • {message.metadata.model.split('/').pop()?.split('-')[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
