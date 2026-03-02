import type { SessionResponse, ApiResponse, Lead } from '../types';

const API_VERSION = 'v1';

class ApiService {
  private baseUrl: string;
  private visitorId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private get headers(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(this.visitorId && { 'X-Visitor-ID': this.visitorId }),
    };
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api/${API_VERSION}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async createSession(sourceUrl?: string, utmData?: Record<string, string>): Promise<SessionResponse> {
    const data = await this.fetch<SessionResponse>('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({
        source_url: sourceUrl || window.location.href,
        utm_data: utmData,
      }),
    });

    this.visitorId = data.visitorId;
    localStorage.setItem('resolver_visitor_id', data.visitorId);
    localStorage.setItem('resolver_session_id', data.sessionId);

    return data;
  }

  async sendMessage(sessionId: string, message: string, context?: Record<string, any>): Promise<ApiResponse> {
    return this.fetch<ApiResponse>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
      }),
    });
  }

  async getEstimate(sessionId: string): Promise<{ estimate: any; leadId: string; explanation: string }> {
    return this.fetch(`/chat/sessions/${sessionId}/estimate`);
  }

  async submitLead(leadData: Partial<Lead>): Promise<{ success: boolean; leadId: string }> {
    return this.fetch('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  // Model management
  async getAvailableModels(): Promise<Array<{ id: string; name: string; provider: string; isAvailable: boolean }>> {
    return this.fetch('/models');
  }

  async setModelPreference(sessionId: string, modelId: string): Promise<void> {
    await this.fetch(`/chat/sessions/${sessionId}/model`, {
      method: 'PUT',
      body: JSON.stringify({ model_id: modelId }),
    });
  }

  // Session recovery
  recoverSession(): { sessionId: string | null; visitorId: string | null } {
    return {
      sessionId: localStorage.getItem('resolver_session_id'),
      visitorId: localStorage.getItem('resolver_visitor_id'),
    };
  }

  clearSession(): void {
    localStorage.removeItem('resolver_session_id');
    localStorage.removeItem('resolver_visitor_id');
    this.visitorId = null;
  }
}

export default ApiService;
