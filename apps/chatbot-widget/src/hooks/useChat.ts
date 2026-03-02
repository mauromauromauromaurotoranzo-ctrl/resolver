import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ApiService from '../services/api';
import type { Message, QuickReply, ChatState, Lead } from '../types';

interface UseChatProps {
  apiEndpoint: string;
  onLeadQualified?: (lead: Lead) => void;
}

interface UseChatReturn {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  state: ChatState;
  sessionId: string | null;
  quickReplies: QuickReply[];
  error: string | null;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  selectQuickReply: (reply: QuickReply) => void;
  hasStarted: boolean;
}

export function useChat({ apiEndpoint, onLeadQualified }: UseChatProps): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ChatState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const apiRef = useRef(new ApiService(apiEndpoint));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        setState('loading');
        
        // Try to recover existing session
        const recovered = apiRef.current.recoverSession();
        
        if (recovered.sessionId && recovered.visitorId) {
          // TODO: Validate session is still active with backend
          setSessionId(recovered.sessionId);
          setHasStarted(true);
          setState('idle');
        }
      } catch (err) {
        console.error('Failed to recover session:', err);
      }
    };

    initSession();
  }, []);

  const startNewSession = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      const data = await apiRef.current.createSession();
      
      setSessionId(data.sessionId);
      setHasStarted(true);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.welcomeMessage,
        timestamp: new Date(),
        metadata: {
          quickReplies: data.quickReplies,
        },
      };
      
      setMessages([welcomeMessage]);
      setQuickReplies(data.quickReplies);
      setState('waiting_for_input');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start chat');
      setState('error');
    }
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!hasStarted) {
      startNewSession();
    }
  }, [hasStarted, startNewSession]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || !content.trim()) return;

    try {
      setState('loading');
      setError(null);
      setQuickReplies([]);

      // Add user message immediately
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate typing delay for natural feel
      setState('typing');
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Send to API
      const response = await apiRef.current.sendMessage(sessionId, content);

      // Add assistant message
      const assistantMessage: Message = {
        id: response.messageId,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metadata: {
          quickReplies: response.quickReplies,
          intent: undefined, // Will be populated from API
          model: response.model,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
      setQuickReplies(response.quickReplies || []);
      setState('waiting_for_input');

      // Check if we have enough info for a lead
      if (response.nextStep === 'estimation_ready') {
        // Trigger lead qualification callback
        onLeadQualified?.({
          id: sessionId,
          ...response.collectedData,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setState('error');
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Disculpá, tuve un problema técnico. ¿Podés intentar de nuevo?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [sessionId, onLeadQualified]);

  const selectQuickReply = useCallback((reply: QuickReply) => {
    sendMessage(reply.label);
  }, [sendMessage]);

  return {
    messages,
    isOpen,
    isLoading: state === 'loading' || state === 'typing',
    state,
    sessionId,
    quickReplies,
    error,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    selectQuickReply,
    hasStarted,
  };
}
