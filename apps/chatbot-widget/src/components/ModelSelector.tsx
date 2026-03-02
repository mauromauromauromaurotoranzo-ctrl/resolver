import React, { useState, useEffect } from 'react';
import type { LLMModel, ModelSelectorProps } from '../types';

const defaultModels: LLMModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excelente para conversaciones naturales y análisis detallado',
    capabilities: ['chat', 'reasoning', 'analysis'],
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
    isAvailable: true,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Versátil y rápido, ideal para la mayoría de consultas',
    capabilities: ['chat', 'coding', 'analysis'],
    contextWindow: 128000,
    costPer1kTokens: { input: 0.005, output: 0.015 },
    isAvailable: true,
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Buen balance entre calidad y velocidad',
    capabilities: ['chat', 'analysis'],
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
    isAvailable: true,
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    description: 'Modelo open source, excelente relación calidad-precio',
    capabilities: ['chat', 'coding'],
    contextWindow: 131072,
    costPer1kTokens: { input: 0.0006, output: 0.0008 },
    isAvailable: true,
  },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models = defaultModels,
  selectedModel,
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<LLMModel | null>(null);

  useEffect(() => {
    const model = models.find(m => m.id === selectedModel);
    if (model) {
      setSelected(model);
    }
  }, [selectedModel, models]);

  const handleSelect = (model: LLMModel) => {
    if (disabled || !model.isAvailable) return;
    
    setSelected(model);
    onSelect(model.id);
    setIsOpen(false);
  };

  const currentModel = selected || models[0];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-200 border
          ${disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' 
            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 cursor-pointer'
          }
        `}
        title="Seleccionar modelo de IA"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-gray-700">{currentModel.name}</span>
        <svg 
          className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-800">Modelo de IA</h4>
              <p className="text-xs text-gray-500 mt-0.5">Selecciona el mejor para tu consulta</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  disabled={!model.isAvailable}
                  className={`
                    w-full text-left p-3 transition-colors border-b border-gray-50 last:border-0
                    ${selected?.id === model.id 
                      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }
                    ${!model.isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-800">
                          {model.name}
                        </span>
                        {selected?.id === model.id && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {model.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {model.provider}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {(model.contextWindow / 1000).toFixed(0)}k contexto
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!model.isAvailable && (
                    <span className="text-[10px] text-red-500 mt-1 block">
                      No disponible temporalmente
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-2 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center">
                Los modelos más avanzados pueden tener mayor latencia
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
