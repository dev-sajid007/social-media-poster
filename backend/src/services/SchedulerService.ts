import cron from 'node-cron';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { facebookService } from './FacebookService';

export class SchedulerService {
  private isRunning = false;

  start(): void {
    if (this.isRunning) {
      console.log('📅 Scheduler is already running');
      return;
    }

    // Run every minute to check for scheduled posts
    cron.schedule('* * * * *', async () => {
      await this.processScheduledPosts();
    });

    this.isRunning = true;
    console.log('📅 Scheduler started - checking for scheduled posts every minute');
  }

  stop(): void {
    this.isRunning = false;
    console.log('📅 Scheduler stopped');
  }

  private async processScheduledPosts(): Promise<void> {
    try {
      const now = new Date();
      
      // Find posts scheduled for now or earlier
      const scheduledPosts = await Post.find({
        status: 'scheduled',
        scheduledFor: { $lte: now }
      }).populate('userId');

      if (scheduledPosts.length === 0) {
        return;
      }

      console.log(`📤 Processing ${scheduledPosts.length} scheduled posts`);

      for (const post of scheduledPosts) {
        await this.processPost(post);
      }
    } catch (error) {
      console.error('❌ Error processing scheduled posts:', error);
    }
  }

  private async processPost(post: any): Promise<void> {
    try {
      console.log(`📤 Processing post ${post._id}`);
      
      const user = await User.findById(post.userId);
      if (!user) {
        console.error(`❌ User not found for post ${post._id}`);
        return;
      }

      // Update post status to posting
      post.status = 'posting';
      await post.save();

      // Process each platform
      for (const platform of post.platforms) {
        if (platform.status !== 'scheduled') {
          continue;
        }

        try {
          await this.postToPlatform(post, platform, user);
        } catch (error) {
          console.error(`❌ Error posting to ${platform.name}:`, error);
          platform.status = 'failed';
          platform.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        }
      }

      // Update overall post status
      const allPosted = post.platforms.every((p: any) => p.status === 'posted');
      const anyFailed = post.platforms.some((p: any) => p.status === 'failed');
      
      if (allPosted) {
        post.status = 'posted';
      } else if (anyFailed) {
        post.status = 'failed';
      }

      await post.save();
      
      console.log(`✅ Finished processing post ${post._id} - Status: ${post.status}`);
    } catch (error) {
      console.error(`❌ Error processing post ${post._id}:`, error);
      post.status = 'failed';
      await post.save();
    }
  }

  private async postToPlatform(post: any, platform: any, user: any): Promise<void> {
    switch (platform.name) {
      case 'facebook':
        await this.postToFacebook(post, platform, user);
        break;
      case 'instagram':
        await this.postToInstagram(post, platform, user);
        break;
      case 'youtube':
        await this.postToYouTube(post, platform, user);
        break;
      case 'whatsapp':
        await this.postToWhatsApp(post, platform, user);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform.name}`);
    }
  }

  private async postToFacebook(post: any, platform: any, user: any): Promise<void> {
    const facebookConfig = user.platforms?.facebook;
    if (!facebookConfig?.accessToken) {
      throw new Error('Facebook not connected');
    }

    // Check if token is still valid
    const isValid = await facebookService.validateToken(facebookConfig.accessToken);
    if (!isValid) {
      throw new Error('Facebook token expired');
    }

    const mediaUrls = post.mediaFiles.map((m: any) => `${process.env.FRONTEND_URL}${m.url}`);
    
    const result = await facebookService.createPost(
      facebookConfig.pageId,
      facebookConfig.accessToken,
      post.content,
      mediaUrls
    );

    platform.postId = result.id;
    platform.status = 'posted';
    platform.postedAt = new Date();
  }

  private async postToInstagram(post: any, platform: any, user: any): Promise<void> {
    const instagramConfig = user.platforms?.instagram;
    if (!instagramConfig?.accessToken) {
      throw new Error('Instagram not connected');
    }

    // Instagram posting logic would go here
    // This is a simplified implementation
    console.log('📸 Posting to Instagram:', post.content);
    
    platform.status = 'posted';
    platform.postedAt = new Date();
  }

  private async postToYouTube(post: any, platform: any, user: any): Promise<void> {
    const youtubeConfig = user.platforms?.youtube;
    if (!youtubeConfig?.accessToken) {
      throw new Error('YouTube not connected');
    }

    // Check if there's a video file
    const videoFile = post.mediaFiles.find((m: any) => m.type === 'video');
    if (!videoFile) {
      throw new Error('No video file found for YouTube post');
    }

    // YouTube video upload logic would go here
    console.log('📺 Uploading to YouTube:', post.content);
    
    platform.status = 'posted';
    platform.postedAt = new Date();
  }

  private async postToWhatsApp(post: any, platform: any, user: any): Promise<void> {
    const whatsappConfig = user.platforms?.whatsapp;
    if (!whatsappConfig?.accessToken) {
      throw new Error('WhatsApp not connected');
    }

    // WhatsApp Business API posting logic would go here
    console.log('💬 Posting to WhatsApp:', post.content);
    
    platform.status = 'posted';
    platform.postedAt = new Date();
  }

  // Method to manually trigger processing of a specific post
  async processPostById(postId: string): Promise<void> {
    const post = await Post.findById(postId).populate('userId');
    if (!post) {
      throw new Error('Post not found');
    }

    await this.processPost(post);
  }

  // Get scheduled posts count
  async getScheduledPostsCount(): Promise<number> {
    return await Post.countDocuments({
      status: 'scheduled',
      scheduledFor: { $gte: new Date() }
    });
  }

  // Get next scheduled post
  async getNextScheduledPost(): Promise<any> {
    return await Post.findOne({
      status: 'scheduled',
      scheduledFor: { $gte: new Date() }
    }).sort({ scheduledFor: 1 });
  }
}

export const schedulerService = new SchedulerService();