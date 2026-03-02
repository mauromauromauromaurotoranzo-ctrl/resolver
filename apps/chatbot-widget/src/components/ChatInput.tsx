import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Escribí tu mensaje...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSend(message.trim());
    setMessage('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 bg-white">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className={`
              w-full px-4 py-3 pr-10 rounded-xl border resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              transition-all duration-200
              ${disabled 
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-50 hover:bg-white border-gray-200'
              }
            `}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <span className={`
              absolute bottom-2 right-3 text-[10px]
              ${message.length > 1800 ? 'text-red-400' : 'text-gray-300'}
            `}>
              {message.length}/2000
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
            transition-all duration-200
            ${disabled || !message.trim()
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg active:scale-95'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Presioná Enter para enviar • Shift+Enter para nueva línea
      </p>
    </form>
  );
};
