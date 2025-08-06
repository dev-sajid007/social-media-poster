import axios from 'axios';
import { createError } from '../middleware/errorHandler';

export class FacebookService {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: redirectUri,
          code
        }
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in
      };
    } catch (error: any) {
      console.error('Facebook token exchange error:', error.response?.data);
      throw createError('Failed to exchange Facebook code for token', 400);
    }
  }

  async getLongLivedToken(shortLivedToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: shortLivedToken
        }
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in || 5184000 // 60 days default
      };
    } catch (error: any) {
      console.error('Facebook long-lived token error:', error.response?.data);
      throw createError('Failed to get long-lived Facebook token', 400);
    }
  }

  async getUserPages(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category,tasks'
        }
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('Facebook pages error:', error.response?.data);
      throw createError('Failed to fetch Facebook pages', 400);
    }
  }

  async createPost(
    pageId: string,
    pageAccessToken: string,
    content: string,
    mediaUrls?: string[]
  ): Promise<{ id: string }> {
    try {
      const postData: any = {
        message: content,
        access_token: pageAccessToken
      };

      // Handle media attachments
      if (mediaUrls && mediaUrls.length > 0) {
        if (mediaUrls.length === 1) {
          // Single media post
          const mediaType = this.getMediaType(mediaUrls[0]);
          if (mediaType === 'photo') {
            postData.url = mediaUrls[0];
            const response = await axios.post(`${this.baseUrl}/${pageId}/photos`, postData);
            return { id: response.data.id };
          } else if (mediaType === 'video') {
            postData.file_url = mediaUrls[0];
            const response = await axios.post(`${this.baseUrl}/${pageId}/videos`, postData);
            return { id: response.data.id };
          }
        } else {
          // Multiple media - create as album
          const mediaObjects = await Promise.all(
            mediaUrls.map(async (url) => {
              const mediaType = this.getMediaType(url);
              if (mediaType === 'photo') {
                const photoResponse = await axios.post(`${this.baseUrl}/${pageId}/photos`, {
                  url,
                  published: false,
                  access_token: pageAccessToken
                });
                return { media_fbid: photoResponse.data.id };
              }
              return null;
            })
          );

          postData.attached_media = mediaObjects.filter(Boolean);
        }
      }

      const response = await axios.post(`${this.baseUrl}/${pageId}/feed`, postData);
      return { id: response.data.id };
    } catch (error: any) {
      console.error('Facebook post creation error:', error.response?.data);
      throw createError('Failed to create Facebook post', 400);
    }
  }

  async getPostInsights(postId: string, accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/${postId}/insights`, {
        params: {
          metric: 'post_reactions_like_total,post_reactions_love_total,post_reactions_wow_total,post_reactions_haha_total,post_reactions_sorry_total,post_reactions_anger_total,post_impressions,post_clicks',
          access_token: accessToken
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Facebook insights error:', error.response?.data);
      return null;
    }
  }

  private getMediaType(url: string): 'photo' | 'video' {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    const extension = url.toLowerCase().substring(url.lastIndexOf('.'));
    return videoExtensions.includes(extension) ? 'video' : 'photo';
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/me`, {
        params: { access_token: accessToken }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const facebookService = new FacebookService();