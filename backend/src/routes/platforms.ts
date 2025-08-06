import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { User } from '../models/User';
import { facebookService } from '../services/FacebookService';
import { youtubeService } from '../services/YouTubeService';

const router = Router();

// Facebook OAuth
router.post('/facebook/connect', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    throw createError('Code and redirect URI are required', 400);
  }

  // Exchange code for access token
  const { accessToken } = await facebookService.exchangeCodeForToken(code, redirectUri);
  
  // Get long-lived token
  const longLivedToken = await facebookService.getLongLivedToken(accessToken);
  
  // Get user's pages
  const pages = await facebookService.getUserPages(longLivedToken.accessToken);

  // Save to user profile
  const expiresAt = new Date(Date.now() + longLivedToken.expiresIn * 1000);
  
  await User.findByIdAndUpdate(req.user!._id, {
    'platforms.facebook': {
      accessToken: longLivedToken.accessToken,
      expiresAt,
      // Save the first page as default, user can change later
      pageId: pages[0]?.id,
      pageName: pages[0]?.name
    }
  });

  res.json({
    success: true,
    message: 'Facebook account connected successfully',
    data: {
      pages,
      expiresAt
    }
  });
}));

// Instagram OAuth (uses Facebook Graph API)
router.post('/instagram/connect', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    throw createError('Code and redirect URI are required', 400);
  }

  // Exchange code for access token (same as Facebook)
  const { accessToken } = await facebookService.exchangeCodeForToken(code, redirectUri);
  
  // Get long-lived token
  const longLivedToken = await facebookService.getLongLivedToken(accessToken);
  
  // For Instagram, we need to get the Instagram Business Account
  // This is a simplified implementation
  const expiresAt = new Date(Date.now() + longLivedToken.expiresIn * 1000);
  
  await User.findByIdAndUpdate(req.user!._id, {
    'platforms.instagram': {
      accessToken: longLivedToken.accessToken,
      userId: 'instagram_user_id', // Would be fetched from Instagram API
      username: 'instagram_username', // Would be fetched from Instagram API
      expiresAt
    }
  });

  res.json({
    success: true,
    message: 'Instagram account connected successfully',
    data: {
      expiresAt
    }
  });
}));

// YouTube OAuth
router.get('/youtube/auth-url', authenticateToken, (_req: AuthRequest, res: Response) => {
  const authUrl = youtubeService.getAuthUrl();
  
  res.json({
    success: true,
    data: {
      authUrl
    }
  });
});

router.post('/youtube/connect', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code } = req.body;

  if (!code) {
    throw createError('Authorization code is required', 400);
  }

  // Exchange code for tokens
  const { accessToken, refreshToken, expiryDate } = await youtubeService.exchangeCodeForTokens(code);
  
  // Get channel info
  const channelInfo = await youtubeService.getChannelInfo(accessToken);
  
  // Save to user profile
  const expiresAt = new Date(expiryDate);
  
  await User.findByIdAndUpdate(req.user!._id, {
    'platforms.youtube': {
      accessToken,
      refreshToken,
      channelId: channelInfo.id,
      channelName: channelInfo.title,
      expiresAt
    }
  });

  res.json({
    success: true,
    message: 'YouTube account connected successfully',
    data: {
      channel: channelInfo,
      expiresAt
    }
  });
}));

// WhatsApp Business (placeholder - requires WhatsApp Business API setup)
router.post('/whatsapp/connect', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { accessToken, phoneNumberId, businessAccountId } = req.body;

  if (!accessToken || !phoneNumberId || !businessAccountId) {
    throw createError('Access token, phone number ID, and business account ID are required', 400);
  }

  // In a real implementation, you would validate the WhatsApp credentials here
  
  await User.findByIdAndUpdate(req.user!._id, {
    'platforms.whatsapp': {
      accessToken,
      phoneNumberId,
      businessAccountId,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }
  });

  res.json({
    success: true,
    message: 'WhatsApp Business account connected successfully'
  });
}));

// Get connected platforms
router.get('/connected', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).select('platforms');
  
  const connectedPlatforms = {
    facebook: !!user?.platforms?.facebook?.accessToken,
    instagram: !!user?.platforms?.instagram?.accessToken,
    youtube: !!user?.platforms?.youtube?.accessToken,
    whatsapp: !!user?.platforms?.whatsapp?.accessToken
  };

  res.json({
    success: true,
    data: {
      platforms: connectedPlatforms,
      details: {
        facebook: user?.platforms?.facebook ? {
          pageName: user.platforms.facebook.pageName,
          expiresAt: user.platforms.facebook.expiresAt
        } : null,
        instagram: user?.platforms?.instagram ? {
          username: user.platforms.instagram.username,
          expiresAt: user.platforms.instagram.expiresAt
        } : null,
        youtube: user?.platforms?.youtube ? {
          channelName: user.platforms.youtube.channelName,
          expiresAt: user.platforms.youtube.expiresAt
        } : null,
        whatsapp: user?.platforms?.whatsapp ? {
          phoneNumberId: user.platforms.whatsapp.phoneNumberId,
          expiresAt: user.platforms.whatsapp.expiresAt
        } : null
      }
    }
  });
}));

// Disconnect platform
router.delete('/:platform/disconnect', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { platform } = req.params;
  
  if (!['facebook', 'instagram', 'youtube', 'whatsapp'].includes(platform)) {
    throw createError('Invalid platform', 400);
  }

  const updateData = { [`platforms.${platform}`]: undefined };
  await User.findByIdAndUpdate(req.user!._id, { $unset: updateData });

  res.json({
    success: true,
    message: `${platform} account disconnected successfully`
  });
}));

export default router;