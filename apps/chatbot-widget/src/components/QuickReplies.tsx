import React from 'react';
import type { QuickReply } from '../types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies,
  onSelect,
  disabled = false,
}) => {
  if (!replies.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2 animate-fade-in">
      {replies.map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            border transition-all duration-200
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
              : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md active:scale-95 cursor-pointer'
            }
          `}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
};
