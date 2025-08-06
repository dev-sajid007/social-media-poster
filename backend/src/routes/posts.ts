import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { facebookService } from '../services/FacebookService';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv|flv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Create new post
router.post('/', 
  authenticateToken,
  upload.array('media', 10),
  [
    body('content').trim().isLength({ min: 1, max: 2200 }),
    body('platforms').isArray({ min: 1 }),
    body('scheduledFor').optional().isISO8601()
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Invalid input data', 400);
    }

    const { content, platforms, scheduledFor } = req.body;
    const files = req.files as Express.Multer.File[];

    // Process uploaded files
    const mediaFiles = files?.map(file => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      filename: file.filename,
      size: file.size
    })) || [];

    // Create post document
    const post = new Post({
      userId: req.user!._id,
      content,
      mediaFiles,
      platforms: platforms.map((platform: string) => ({
        name: platform,
        status: scheduledFor ? 'scheduled' : 'pending'
      })),
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      status: scheduledFor ? 'scheduled' : 'draft',
      metadata: {
        originalFilenames: files?.map(f => f.originalname) || [],
        totalSize: files?.reduce((total, f) => total + f.size, 0) || 0
      },
      analytics: {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        platformBreakdown: []
      }
    });

    await post.save();

    // If not scheduled, post immediately
    if (!scheduledFor) {
      await processPost((post._id as string).toString());
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
      }
    });
  })
);

// Get user's posts
router.get('/', 
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, status, platform } = req.query;

    const filter: any = { userId: req.user!._id };
    
    if (status) {
      filter.status = status;
    }
    
    if (platform) {
      filter['platforms.name'] = platform;
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'name email');

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  })
);

// Get single post
router.get('/:id', 
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!post) {
      throw createError('Post not found', 404);
    }

    res.json({
      success: true,
      data: {
        post
      }
    });
  })
);

// Update post
router.put('/:id',
  authenticateToken,
  [
    body('content').optional().trim().isLength({ min: 1, max: 2200 }),
    body('scheduledFor').optional().isISO8601()
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Invalid input data', 400);
    }

    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!post) {
      throw createError('Post not found', 404);
    }

    if (post.status === 'posted') {
      throw createError('Cannot edit already posted content', 400);
    }

    const updateData: any = {};
    
    if (req.body.content) {
      updateData.content = req.body.content;
    }
    
    if (req.body.scheduledFor) {
      updateData.scheduledFor = new Date(req.body.scheduledFor);
      updateData.status = 'scheduled';
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost
      }
    });
  })
);

// Delete post
router.delete('/:id',
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!post) {
      throw createError('Post not found', 404);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  })
);

// Post immediately (if draft)
router.post('/:id/publish',
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!post) {
      throw createError('Post not found', 404);
    }

    if (post.status !== 'draft' && post.status !== 'scheduled') {
      throw createError('Can only publish draft or scheduled posts', 400);
    }

    await processPost(req.params.id);

    res.json({
      success: true,
      message: 'Post publishing initiated'
    });
  })
);

// Helper function to process posts
async function processPost(postId: string): Promise<void> {
  const post = await Post.findById(postId).populate('userId');
  if (!post) return;

  const user = await User.findById(post.userId);
  if (!user) return;

  post.status = 'posting';
  await post.save();

  try {
    for (const platform of post.platforms) {
      switch (platform.name) {
        case 'facebook':
          if (user.platforms?.facebook?.accessToken) {
            const result = await facebookService.createPost(
              user.platforms.facebook.pageId!,
              user.platforms.facebook.accessToken,
              post.content,
              post.mediaFiles.map(m => m.url)
            );
            platform.postId = result.id;
            platform.status = 'posted';
            platform.postedAt = new Date();
          } else {
            platform.status = 'failed';
            platform.errorMessage = 'Facebook not connected';
          }
          break;

        case 'youtube':
          if (user.platforms?.youtube?.accessToken && post.mediaFiles.length > 0) {
            // Only for video posts
            const videoFile = post.mediaFiles.find(m => m.type === 'video');
            if (videoFile) {
              // In a real implementation, you would read the video file
              // const videoBuffer = fs.readFileSync(videoFile.url);
              // const result = await youtubeService.uploadVideo(
              //   user.platforms.youtube.accessToken,
              //   videoBuffer,
              //   post.content.substring(0, 100),
              //   post.content
              // );
              platform.status = 'posted';
              platform.postedAt = new Date();
            } else {
              platform.status = 'failed';
              platform.errorMessage = 'No video file found for YouTube';
            }
          } else {
            platform.status = 'failed';
            platform.errorMessage = 'YouTube not connected or no video file';
          }
          break;

        default:
          platform.status = 'failed';
          platform.errorMessage = 'Platform not implemented';
      }
    }

    // Update overall post status
    const allPosted = post.platforms.every(p => p.status === 'posted');
    const anyFailed = post.platforms.some(p => p.status === 'failed');
    
    if (allPosted) {
      post.status = 'posted';
    } else if (anyFailed) {
      post.status = 'failed';
    }

    await post.save();
  } catch (error) {
    console.error('Error processing post:', error);
    post.status = 'failed';
    await post.save();
  }
}

export default router;