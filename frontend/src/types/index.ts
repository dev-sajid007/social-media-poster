export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  platforms?: {
    facebook?: {
      pageName?: string;
      expiresAt?: string;
    };
    instagram?: {
      username?: string;
      expiresAt?: string;
    };
    youtube?: {
      channelName?: string;
      expiresAt?: string;
    };
    whatsapp?: {
      phoneNumberId?: string;
      expiresAt?: string;
    };
  };
  preferences?: {
    timezone: string;
    defaultPlatforms: string[];
    autoScheduling: boolean;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Post {
  _id: string;
  content: string;
  mediaFiles: MediaFile[];
  platforms: PlatformPost[];
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'posting' | 'posted' | 'failed';
  analytics: PostAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
}

export interface PlatformPost {
  name: 'facebook' | 'instagram' | 'youtube' | 'whatsapp';
  postId?: string;
  status: 'pending' | 'posted' | 'failed' | 'scheduled';
  errorMessage?: string;
  postedAt?: string;
  engagementData?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
}

export interface PostAnalytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  platformBreakdown: {
    platform: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
  };
}

export interface DashboardData {
  overview: {
    totalPosts: number;
    scheduledPosts: number;
    postedToday: number;
    totalEngagement: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
  };
  recentPosts: Post[];
  platformStats: {
    _id: string;
    totalPosts: number;
    successfulPosts: number;
  }[];
}