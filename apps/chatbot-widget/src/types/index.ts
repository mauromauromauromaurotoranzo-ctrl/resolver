export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    quickReplies?: QuickReply[];
    intent?: string;
    tokensUsed?: number;
    model?: string;
  };
}

export interface QuickReply {
  id: string;
  label: string;
  action?: string;
}

export interface ChatSession {
  id: string;
  visitorId: string;
  status: 'active' | 'completed' | 'abandoned';
  messages: Message[];
  collectedData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetConfig {
  apiEndpoint: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  botName?: string;
  botAvatar?: string;
  welcomeMessage?: string;
  showOnLoad?: boolean;
  delayBeforeShow?: number;
  autoOpenAfter?: number;
  onLeadQualified?: (lead: Lead) => void;
  onMeetingScheduled?: (event: any) => void;
}

export interface Lead {
  id: string;
  email?: string;
  industry?: string;
  projectType?: string;
  problemDescription?: string;
  estimatedCost?: {
    min: number;
    max: number;
    currency: string;
  };
  estimatedWeeks?: {
    min: number;
    max: number;
  };
  complexity?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: ('chat' | 'reasoning' | 'coding' | 'analysis')[];
  contextWindow: number;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  isAvailable: boolean;
}

export interface ModelSelectorProps {
  models: LLMModel[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
  disabled?: boolean;
}

export interface ChatWidgetProps extends WidgetConfig {}

export type ChatState = 
  | 'idle'
  | 'loading'
  | 'typing'
  | 'error'
  | 'waiting_for_input';

export interface ApiResponse {
  messageId: string;
  response: string;
  quickReplies?: QuickReply[];
  collectedData?: Record<string, any>;
  nextStep?: string;
  fallback?: boolean;
  model?: string;
}

export interface SessionResponse {
  sessionId: string;
  visitorId: string;
  welcomeMessage: string;
  quickReplies: QuickReply[];
}
