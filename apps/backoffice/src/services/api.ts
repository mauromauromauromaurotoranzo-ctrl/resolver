import type { Lead, ChatSession, BotConfiguration, DashboardStats } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('resolver_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('resolver_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('resolver_token');
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<any> {
    return this.fetch('/auth/me');
  }

  // Leads
  async getLeads(params?: {
    status?: string;
    industry?: string;
    assignedTo?: string;
    sortBy?: string;
    page?: number;
    perPage?: number;
  }): Promise<{ data: Lead[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/admin/leads?${queryParams.toString()}`);
  }

  async getLead(id: string): Promise<{ lead: Lead; conversation: ChatSession }> {
    return this.fetch(`/admin/leads/${id}`);
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    return this.fetch(`/admin/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Stats
  async getStats(): Promise<DashboardStats> {
    return this.fetch('/admin/stats');
  }

  // Bot Configuration
  async getConfigurations(): Promise<BotConfiguration[]> {
    return this.fetch('/admin/configurations');
  }

  async getActiveConfiguration(): Promise<BotConfiguration> {
    return this.fetch('/admin/configurations/active');
  }

  async createConfiguration(data: Partial<BotConfiguration>): Promise<BotConfiguration> {
    return this.fetch('/admin/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConfiguration(id: string, data: Partial<BotConfiguration>): Promise<BotConfiguration> {
    return this.fetch(`/admin/configurations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async activateConfiguration(id: string): Promise<void> {
    return this.fetch(`/admin/configurations/${id}/activate`, {
      method: 'POST',
    });
  }

  // Active Sessions
  async getActiveSessions(): Promise<ChatSession[]> {
    return this.fetch('/admin/sessions/active');
  }
}

export default new ApiService();
