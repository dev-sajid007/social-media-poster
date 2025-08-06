import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  platforms: {
    facebook?: {
      accessToken: string;
      refreshToken?: string;
      pageId?: string;
      pageName?: string;
      expiresAt?: Date;
    };
    instagram?: {
      accessToken: string;
      userId: string;
      username: string;
      expiresAt?: Date;
    };
    youtube?: {
      accessToken: string;
      refreshToken: string;
      channelId: string;
      channelName: string;
      expiresAt?: Date;
    };
    whatsapp?: {
      accessToken: string;
      phoneNumberId: string;
      businessAccountId: string;
      expiresAt?: Date;
    };
  };
  preferences: {
    timezone: string;
    defaultPlatforms: string[];
    autoScheduling: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  platforms: {
    facebook: {
      accessToken: String,
      refreshToken: String,
      pageId: String,
      pageName: String,
      expiresAt: Date
    },
    instagram: {
      accessToken: String,
      userId: String,
      username: String,
      expiresAt: Date
    },
    youtube: {
      accessToken: String,
      refreshToken: String,
      channelId: String,
      channelName: String,
      expiresAt: Date
    },
    whatsapp: {
      accessToken: String,
      phoneNumberId: String,
      businessAccountId: String,
      expiresAt: Date
    }
  },
  preferences: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    defaultPlatforms: [{
      type: String,
      enum: ['facebook', 'instagram', 'youtube', 'whatsapp']
    }],
    autoScheduling: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);