import { environment } from '../environment';
import AuthService from './AuthService';

export interface DictionaryEntry {
  id: string;
  tarifitWord: string;
  frenchTranslation: string;
  arabicTranslation?: string;
  category?: string;
  pronunciation?: string;
  examples?: string[];
}

export interface Sentence {
  id: string;
  tarifitSentence: string;
  frenchTranslation: string;
  arabicTranslation?: string;
  difficulty?: string;
  category?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  translation?: string;
  difficulty?: string;
  category?: string;
}

export interface Verb {
  id: string;
  infinitive: string;
  frenchTranslation: string;
  arabicTranslation?: string;
  conjugations?: Record<string, string>;
}

export interface SearchResult {
  entries: DictionaryEntry[];
  total: number;
  page: number;
  size: number;
}

class ContentService {
  private baseUrl = environment.services.content.baseUrl;
  private endpoints = environment.services.content.endpoints;

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Dictionary Methods
  async getDictionaryAqelei(page = 0, size = 20): Promise<SearchResult> {
    const url = `${this.baseUrl}${this.endpoints.dictionary.aqelei}?page=${page}&size=${size}`;
    return this.makeRequest<SearchResult>(url);
  }

  async getDictionaryWaryaghri(page = 0, size = 20): Promise<SearchResult> {
    const url = `${this.baseUrl}${this.endpoints.dictionary.waryaghri}?page=${page}&size=${size}`;
    return this.makeRequest<SearchResult>(url);
  }

  async searchDictionary(
    query: string, 
    dialect?: 'aqelei' | 'waryaghri',
    page = 0, 
    size = 20
  ): Promise<SearchResult> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      size: size.toString(),
    });

    if (dialect) {
      params.append('dialect', dialect);
    }

    const url = `${this.baseUrl}${this.endpoints.dictionary.search}?${params}`;
    return this.makeRequest<SearchResult>(url);
  }

  async getDictionaryEntry(id: string): Promise<DictionaryEntry> {
    const url = `${this.baseUrl}${this.endpoints.dictionary.aqelei}/${id}`;
    return this.makeRequest<DictionaryEntry>(url);
  }

  // Sentences Methods
  async getSentences(page = 0, size = 20, category?: string): Promise<{
    sentences: Sentence[];
    total: number;
    page: number;
    size: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    const url = `${this.baseUrl}${this.endpoints.sentences}?${params}`;
    return this.makeRequest(url);
  }

  async getSentenceById(id: string): Promise<Sentence> {
    const url = `${this.baseUrl}${this.endpoints.sentences}/${id}`;
    return this.makeRequest<Sentence>(url);
  }

  async searchSentences(query: string, page = 0, size = 20): Promise<{
    sentences: Sentence[];
    total: number;
    page: number;
    size: number;
  }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      size: size.toString(),
    });

    const url = `${this.baseUrl}${this.endpoints.sentences}/search?${params}`;
    return this.makeRequest(url);
  }

  // Stories Methods
  async getStories(page = 0, size = 20, difficulty?: string): Promise<{
    stories: Story[];
    total: number;
    page: number;
    size: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (difficulty) {
      params.append('difficulty', difficulty);
    }

    const url = `${this.baseUrl}${this.endpoints.stories}?${params}`;
    return this.makeRequest(url);
  }

  async getStoryById(id: string): Promise<Story> {
    const url = `${this.baseUrl}${this.endpoints.stories}/${id}`;
    return this.makeRequest<Story>(url);
  }

  // Verbs Methods
  async getVerbs(page = 0, size = 20): Promise<{
    verbs: Verb[];
    total: number;
    page: number;
    size: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const url = `${this.baseUrl}${this.endpoints.verbs}?${params}`;
    return this.makeRequest(url);
  }

  async getVerbById(id: string): Promise<Verb> {
    const url = `${this.baseUrl}${this.endpoints.verbs}/${id}`;
    return this.makeRequest<Verb>(url);
  }

  async conjugateVerb(verbId: string, tense?: string): Promise<Record<string, string>> {
    const params = tense ? `?tense=${tense}` : '';
    const url = `${this.baseUrl}${this.endpoints.verbs}/${verbId}/conjugate${params}`;
    return this.makeRequest<Record<string, string>>(url);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const url = `${this.baseUrl}${this.endpoints.health}`;
    return this.makeRequest(url);
  }
}

export default new ContentService();