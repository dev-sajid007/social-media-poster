import { google } from 'googleapis';
import { createError } from '../middleware/errorHandler';

export class YouTubeService {
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date
      };
    } catch (error: any) {
      console.error('YouTube token exchange error:', error);
      throw createError('Failed to exchange YouTube code for tokens', 400);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    expiryDate: number;
  }> {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      return {
        accessToken: credentials.access_token,
        expiryDate: credentials.expiry_date
      };
    } catch (error: any) {
      console.error('YouTube token refresh error:', error);
      throw createError('Failed to refresh YouTube access token', 400);
    }
  }

  async getChannelInfo(accessToken: string): Promise<{
    id: string;
    title: string;
    description: string;
    thumbnails: any;
  }> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken
      });

      const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
      
      const response = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true
      });

      const channel = response.data.items?.[0];
      if (!channel) {
        throw createError('No YouTube channel found', 404);
      }

      return {
        id: channel.id!,
        title: channel.snippet!.title!,
        description: channel.snippet!.description!,
        thumbnails: channel.snippet!.thumbnails
      };
    } catch (error: any) {
      console.error('YouTube channel info error:', error);
      throw createError('Failed to fetch YouTube channel info', 400);
    }
  }

  async uploadVideo(
    accessToken: string,
    videoFile: Buffer,
    title: string,
    description: string,
    tags: string[] = [],
    privacyStatus: 'private' | 'public' | 'unlisted' = 'public'
  ): Promise<{ id: string; url: string }> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken
      });

      const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });

      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title,
            description,
            tags,
            categoryId: '22' // People & Blogs
          },
          status: {
            privacyStatus
          }
        },
        media: {
          body: videoFile
        }
      });

      const videoId = response.data.id!;
      return {
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    } catch (error: any) {
      console.error('YouTube video upload error:', error);
      throw createError('Failed to upload video to YouTube', 400);
    }
  }

  async createCommunityPost(
    accessToken: string,
    text: string,
    imageUrl?: string
  ): Promise<{ id: string }> {
    try {
      // Note: Community posts require YouTube API v3 and special permissions
      // This is a placeholder implementation as the Community Posts API has limited access
      this.oauth2Client.setCredentials({
        access_token: accessToken
      });

      // For now, we'll return a simulated response
      // In a real implementation, you would need to apply for Community Posts API access
      console.log('Community post would be created with:', { text, imageUrl });
      
      return {
        id: `community_post_${Date.now()}`
      };
    } catch (error: any) {
      console.error('YouTube community post error:', error);
      throw createError('Failed to create YouTube community post', 400);
    }
  }

  async getVideoAnalytics(
    accessToken: string,
    videoId: string
  ): Promise<any> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken
      });

      const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
      
      const response = await youtube.videos.list({
        part: ['statistics', 'snippet'],
        id: [videoId]
      });

      const video = response.data.items?.[0];
      if (!video) {
        return null;
      }

      return {
        views: parseInt(video.statistics?.viewCount || '0'),
        likes: parseInt(video.statistics?.likeCount || '0'),
        comments: parseInt(video.statistics?.commentCount || '0'),
        title: video.snippet?.title,
        publishedAt: video.snippet?.publishedAt
      };
    } catch (error: any) {
      console.error('YouTube analytics error:', error);
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken
      });

      const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
      await youtube.channels.list({
        part: ['snippet'],
        mine: true
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}

export const youtubeService = new YouTubeService();