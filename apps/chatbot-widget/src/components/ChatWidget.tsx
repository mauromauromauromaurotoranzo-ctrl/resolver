import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import type { ChatWidgetProps } from '../types';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiEndpoint,
  position = 'bottom-right',
  primaryColor = '#3B82F6',
  botName = 'Resolver Assistant',
  botAvatar,
  showOnLoad = false,
  delayBeforeShow = 0,
  onLeadQualified,
}) => {
  const {
    messages,
    isOpen,
    isLoading,
    state,
    quickReplies,
    error,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    selectQuickReply,
    submitQuote,
    hasStarted,
  } = useChat({ apiEndpoint, onLeadQualified });

  const [showQuoteModal, setShowQuoteModal] = React.useState(false);
  const [quoteForm, setQuoteForm] = React.useState({
    email: '',
    phone: '',
    contactName: '',
    companyName: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = React.useState('anthropic/claude-3.5-sonnet');
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-open after delay
  useEffect(() => {
    if (showOnLoad && delayBeforeShow > 0) {
      const timer = setTimeout(() => {
        openChat();
      }, delayBeforeShow);
      return () => clearTimeout(timer);
    }
  }, [showOnLoad, delayBeforeShow, openChat]);

  // Listen for openResolverChat event from landing page
  useEffect(() => {
    const handleOpenChatEvent = () => {
      if (!isOpen) {
        openChat();
      }
    };

    window.addEventListener('openResolverChat', handleOpenChatEvent);
    window.addEventListener('resolver-chat-open', handleOpenChatEvent);

    return () => {
      window.removeEventListener('openResolverChat', handleOpenChatEvent);
      window.removeEventListener('resolver-chat-open', handleOpenChatEvent);
    };
  }, [isOpen, openChat]);

  const positionClasses = {
    'bottom-right': 'right-4 sm:right-6',
    'bottom-left': 'left-4 sm:left-6',
  };

  const containerPosition = isExpanded
    ? 'inset-x-0 bottom-0 flex justify-center'
    : `bottom-4 sm:bottom-6 ${positionClasses[position]}`;

  return (
    <div className={`fixed ${containerPosition} z-50 font-sans`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="group flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-slow"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="font-medium pr-1">Charlemos</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="animate-slide-up">
          <div
            className={`
              bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden
              ${isExpanded
                ? 'w-[95vw] sm:w-[900px] h-[85vh] max-h-[90vh]'
                : 'w-[90vw] sm:w-[400px] h-[70vh] sm:h-[600px] max-h-[700px]'}
            `}
          >
            
            {/* Header */}
            <div 
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {botAvatar ? (
                    <img src={botAvatar} alt={botName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold">R</span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{botName}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-xs">En línea</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ModelSelector
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                  disabled={isLoading}
                />
                
                {/* Expand / collapse button */}
                <button
                  onClick={() => setIsExpanded(prev => !prev)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={isExpanded ? 'Reducir chat' : 'Expandir chat'}
                >
                  {isExpanded ? (
                    // Minimize icon
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 14h6v6M4 10h6V4M14 4h6v6M14 20v-6h6"
                      />
                    </svg>
                  ) : (
                    // Maximize icon
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 9V4h5M4 15v5h5M20 9V4h-5M20 15v5h-5"
                      />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={closeChat}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {!hasStarted ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Iniciando conversación...</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      botAvatar={botAvatar}
                      botName={botName}
                    />
                  ))}

                  {isLoading && state === 'typing' && (
                    <TypingIndicator botName={botName} />
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <QuickReplies
                    replies={quickReplies}
                    onSelect={selectQuickReply}
                    disabled={isLoading}
                  />

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white">
              <ChatInput
                onSend={sendMessage}
                disabled={isLoading || !hasStarted}
                placeholder={hasStarted ? 'Escribí tu mensaje...' : 'Esperando a iniciar...'}
              />
              
              {/* Quote Button */}
              {hasStarted && messages.length > 1 && (
                <div className="px-4 pb-3">
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    disabled={isLoading}
                    className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Enviar y Cotizar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4">Enviar solicitud de cotización</h3>
            <p className="text-gray-600 text-sm mb-6">
              Completa tus datos para que podamos contactarte con la cotización de tu proyecto.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={quoteForm.contactName}
                  onChange={(e) => setQuoteForm({ ...quoteForm, contactName: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  placeholder="+54 11 1234-5678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={quoteForm.companyName}
                  onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                  placeholder="Nombre de tu empresa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await submitQuote(quoteForm);
                  setShowQuoteModal(false);
                  setQuoteForm({ email: '', phone: '', contactName: '', companyName: '' });
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
