import React from 'react';

interface TypingIndicatorProps {
  botName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  botName = 'Resolver Assistant',
}) => {
  return (
    <div className="flex gap-3 mb-4 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
        R
      </div>

      {/* Typing Animation */}
      <div className="flex flex-col max-w-[80%]">
        <span className="text-xs text-gray-500 mb-1 ml-1">{botName} está escribiendo...</span>
        
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <div className="flex gap-1">
            <span 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
