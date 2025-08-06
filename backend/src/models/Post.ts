import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  mediaFiles: {
    url: string;
    type: 'image' | 'video';
    filename: string;
    size: number;
  }[];
  platforms: {
    name: 'facebook' | 'instagram' | 'youtube' | 'whatsapp';
    postId?: string;
    status: 'pending' | 'posted' | 'failed' | 'scheduled';
    errorMessage?: string;
    postedAt?: Date;
    engagementData?: {
      likes?: number;
      comments?: number;
      shares?: number;
      views?: number;
    };
  }[];
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'posting' | 'posted' | 'failed';
  metadata: {
    originalFilenames?: string[];
    totalSize?: number;
    hashtags?: string[];
    mentions?: string[];
  };
  analytics: {
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
  };
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2200 // Facebook's character limit
  },
  mediaFiles: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }],
  platforms: [{
    name: {
      type: String,
      enum: ['facebook', 'instagram', 'youtube', 'whatsapp'],
      required: true
    },
    postId: String,
    status: {
      type: String,
      enum: ['pending', 'posted', 'failed', 'scheduled'],
      default: 'pending'
    },
    errorMessage: String,
    postedAt: Date,
    engagementData: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 }
    }
  }],
  scheduledFor: Date,
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posting', 'posted', 'failed'],
    default: 'draft'
  },
  metadata: {
    originalFilenames: [String],
    totalSize: Number,
    hashtags: [String],
    mentions: [String]
  },
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    platformBreakdown: [{
      platform: String,
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    }]
  }
}, {
  timestamps: true
});

// Index for efficient queries
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ scheduledFor: 1, status: 1 });
postSchema.index({ 'platforms.name': 1, 'platforms.status': 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);