export interface Lead {
  id: string;
  sessionId: string;
  email?: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  projectType: 'software' | 'agent_ai' | 'consulting' | 'unknown';
  problemDescription?: string;
  currentSolution?: string;
  timeline?: string;
  budgetRange?: string;
  decisionMaker?: boolean;
  complexityScore: number;
  estimatedWeeksMin: number;
  estimatedWeeksMax: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
  assignedTo?: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  visitorId: string;
  status: 'active' | 'completed' | 'abandoned';
  sourceUrl?: string;
  utmData?: Record<string, string>;
  collectedData?: Record<string, any>;
  leadScore?: number;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    intent?: string;
    tokensUsed?: number;
    model?: string;
  };
  createdAt: string;
}

export interface BotConfiguration {
  id: string;
  name: string;
  version: string;
  systemPrompt: string;
  flowConfig?: Record<string, any>;
  defaultModel?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  leadsByStatus: Record<string, number>;
  avgProjectValue: number;
  conversionRate: number;
  topIndustries: Record<string, number>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
}

export type LeadStatus = Lead['status'];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  proposal_sent: 'Propuesta enviada',
  won: 'Ganado',
  lost: 'Perdido',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal_sent: 'bg-orange-100 text-orange-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};
