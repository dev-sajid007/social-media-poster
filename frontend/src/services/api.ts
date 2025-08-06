import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('accessToken');
  }

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        headers: this.getAuthHeaders(),
        ...config,
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse: any = await this.refreshToken(refreshToken);
            this.setToken(refreshResponse.data.accessToken);
            
            // Retry the original request
            const retryResponse: AxiosResponse<T> = await axios({
              method,
              url: `${this.baseURL}${endpoint}`,
              data,
              headers: this.getAuthHeaders(),
              ...config,
            });
            
            return retryResponse.data;
          } catch (refreshError) {
            this.clearToken();
            window.location.href = '/login';
            throw refreshError;
          }
        } else {
          this.clearToken();
          window.location.href = '/login';
        }
      }
      
      throw error.response?.data || error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('POST', '/auth/login', { email, password });
  }

  async register(name: string, email: string, password: string) {
    return this.request('POST', '/auth/register', { name, email, password });
  }

  async refreshToken(refreshToken: string) {
    return this.request('POST', '/auth/refresh', { refreshToken });
  }

  async getCurrentUser() {
    return this.request('GET', '/auth/me');
  }

  async logout() {
    const result = await this.request('POST', '/auth/logout');
    this.clearToken();
    return result;
  }

  // Posts endpoints
  async getPosts(page = 1, limit = 10, status?: string, platform?: string) {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    
    if (status) params.append('status', status);
    if (platform) params.append('platform', platform);
    
    return this.request('GET', `/posts?${params}`);
  }

  async getPost(id: string) {
    return this.request('GET', `/posts/${id}`);
  }

  async createPost(formData: FormData) {
    return this.request('POST', '/posts', formData, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updatePost(id: string, data: any) {
    return this.request('PUT', `/posts/${id}`, data);
  }

  async deletePost(id: string) {
    return this.request('DELETE', `/posts/${id}`);
  }

  async publishPost(id: string) {
    return this.request('POST', `/posts/${id}/publish`);
  }

  // User endpoints
  async getUserProfile() {
    return this.request('GET', '/users/profile');
  }

  async updateUserProfile(data: any) {
    return this.request('PUT', '/users/profile', data);
  }

  async getDashboardData() {
    return this.request('GET', '/users/dashboard');
  }

  async getSchedule(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request('GET', `/users/schedule?${params}`);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('PUT', '/users/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Platform endpoints
  async connectFacebook(code: string, redirectUri: string) {
    return this.request('POST', '/platforms/facebook/connect', { code, redirectUri });
  }

  async connectInstagram(code: string, redirectUri: string) {
    return this.request('POST', '/platforms/instagram/connect', { code, redirectUri });
  }

  async getYouTubeAuthUrl() {
    return this.request('GET', '/platforms/youtube/auth-url');
  }

  async connectYouTube(code: string) {
    return this.request('POST', '/platforms/youtube/connect', { code });
  }

  async connectWhatsApp(accessToken: string, phoneNumberId: string, businessAccountId: string) {
    return this.request('POST', '/platforms/whatsapp/connect', {
      accessToken,
      phoneNumberId,
      businessAccountId,
    });
  }

  async getConnectedPlatforms() {
    return this.request('GET', '/platforms/connected');
  }

  async disconnectPlatform(platform: string) {
    return this.request('DELETE', `/platforms/${platform}/disconnect`);
  }
}

export const apiService = new ApiService();