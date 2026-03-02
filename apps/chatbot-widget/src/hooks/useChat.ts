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
  const sessionIdRef = useRef<string | null>(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        setState('loading');
        
        // Try to recover existing session
        const recovered = apiRef.current.recoverSession();
        
        console.log('Recovered session:', recovered);
        
        // Only restore if we have a valid sessionId
        if (recovered.sessionId && recovered.visitorId && recovered.sessionId !== 'undefined' && recovered.sessionId !== 'null') {
          // TODO: Validate session is still active with backend
          setSessionId(recovered.sessionId);
          sessionIdRef.current = recovered.sessionId;
          setHasStarted(true);
          setState('idle');
          console.log('Session restored:', recovered.sessionId);
        } else {
          // Clear invalid session data
          console.log('No valid session found, clearing localStorage');
          apiRef.current.clearSession();
          setHasStarted(false);
          setState('idle');
        }
      } catch (err) {
        console.error('Failed to recover session:', err);
        setHasStarted(false);
        setState('idle');
      }
    };

    initSession();
  }, []);

  const startNewSession = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      const data = await apiRef.current.createSession();
      
      console.log('Session data received:', data);
      console.log('SessionId:', data.sessionId);
      
      if (!data.sessionId) {
        throw new Error('Session ID not received from API');
      }
      
      setSessionId(data.sessionId);
      sessionIdRef.current = data.sessionId;
      setHasStarted(true);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.welcomeMessage || data.welcome_message || '¡Hola! ¿En qué puedo ayudarte?',
        timestamp: new Date(),
        metadata: {
          quickReplies: data.quickReplies || data.quick_replies || [],
        },
      };
      
      setMessages([welcomeMessage]);
      setQuickReplies(data.quickReplies || data.quick_replies || []);
      setState('waiting_for_input');
    } catch (err) {
      console.error('Error starting session:', err);
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
    if (!content.trim()) {
      console.error('Cannot send message - empty content');
      return;
    }

    // Use ref to get the latest sessionId value, fallback to localStorage
    let currentSessionId = sessionIdRef.current || sessionId || localStorage.getItem('resolver_session_id');
    
    console.log('sendMessage - sessionIdRef.current:', sessionIdRef.current);
    console.log('sendMessage - sessionId state:', sessionId);
    console.log('sendMessage - localStorage sessionId:', localStorage.getItem('resolver_session_id'));
    console.log('sendMessage - hasStarted:', hasStarted);
    console.log('sendMessage - currentSessionId:', currentSessionId);
    
    // If no session exists OR hasStarted is true but sessionId is missing, create one
    if (!currentSessionId || currentSessionId === 'undefined' || currentSessionId === 'null') {
      console.log('No valid session found, creating new session...');
      console.log('hasStarted:', hasStarted, 'currentSessionId:', currentSessionId);
      try {
        const data = await apiRef.current.createSession();
        console.log('Session created in sendMessage:', data);
        
        if (!data.sessionId) {
          throw new Error('Session ID not received from API');
        }
        
        currentSessionId = data.sessionId;
        setSessionId(data.sessionId);
        sessionIdRef.current = data.sessionId;
        setHasStarted(true);
        
        console.log('Session ID set:', currentSessionId);
      } catch (err) {
        console.error('Failed to create session in sendMessage:', err);
        setError('No se pudo iniciar la sesión. Por favor, intenta de nuevo.');
        setHasStarted(false);
        return;
      }
    }
    
    if (!currentSessionId || currentSessionId === 'undefined' || currentSessionId === 'null') {
      console.error('Cannot send message - no valid sessionId available');
      setError('No hay una sesión activa. Por favor, intenta de nuevo.');
      setHasStarted(false);
      return;
    }
    
    console.log('Sending message with sessionId:', currentSessionId);

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
      const response = await apiRef.current.sendMessage(currentSessionId, content);

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
          id: currentSessionId,
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
  }, [sessionId, hasStarted, onLeadQualified]); // Keep sessionId in deps for reactivity, but use ref for actual value

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
