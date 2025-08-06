import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { User } from '../models/User';
import { Post } from '../models/Post';

const router = Router();

// Get user profile
router.get('/profile', 
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!._id).select('-password');
    
    res.json({
      success: true,
      data: {
        user
      }
    });
  })
);

// Update user profile
router.put('/profile',
  authenticateToken,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('avatar').optional().isURL(),
    body('preferences.timezone').optional().isString(),
    body('preferences.defaultPlatforms').optional().isArray(),
    body('preferences.autoScheduling').optional().isBoolean()
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Invalid input data', 400);
    }

    const updateData: any = {};
    
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.avatar) updateData.avatar = req.body.avatar;
    if (req.body.preferences) {
      updateData.preferences = {
        ...req.user!.preferences,
        ...req.body.preferences
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  })
);

// Get user analytics/dashboard data
router.get('/dashboard',
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get post statistics
    const totalPosts = await Post.countDocuments({ userId: req.user!._id });
    const scheduledPosts = await Post.countDocuments({ 
      userId: req.user!._id, 
      status: 'scheduled' 
    });
    const postedToday = await Post.countDocuments({
      userId: req.user!._id,
      status: 'posted',
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    // Get recent posts
    const recentPosts = await Post.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('content status platforms createdAt analytics');

    // Calculate total engagement
    const allPosts = await Post.find({ userId: req.user!._id });
    const totalEngagement = allPosts.reduce((acc, post) => ({
      views: acc.views + (post.analytics?.totalViews || 0),
      likes: acc.likes + (post.analytics?.totalLikes || 0),
      comments: acc.comments + (post.analytics?.totalComments || 0),
      shares: acc.shares + (post.analytics?.totalShares || 0)
    }), { views: 0, likes: 0, comments: 0, shares: 0 });

    // Get platform statistics
    const platformStats = await Post.aggregate([
      { $match: { userId: req.user!._id } },
      { $unwind: '$platforms' },
      {
        $group: {
          _id: '$platforms.name',
          totalPosts: { $sum: 1 },
          successfulPosts: {
            $sum: { $cond: [{ $eq: ['$platforms.status', 'posted'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalPosts,
          scheduledPosts,
          postedToday,
          totalEngagement
        },
        recentPosts,
        platformStats
      }
    });
  })
);

// Get user's posting schedule
router.get('/schedule',
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    
    const filter: any = { 
      userId: req.user!._id,
      status: 'scheduled'
    };

    if (startDate && endDate) {
      filter.scheduledFor = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const scheduledPosts = await Post.find(filter)
      .sort({ scheduledFor: 1 })
      .select('content scheduledFor platforms mediaFiles');

    res.json({
      success: true,
      data: {
        scheduledPosts
      }
    });
  })
);

// Change password
router.put('/change-password',
  authenticateToken,
  [
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 6 })
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Invalid input data', 400);
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      throw createError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw createError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

export default router;