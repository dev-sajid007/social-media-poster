# Platform Setup Guide

This guide explains how to set up API credentials for each social media platform.

## Facebook/Instagram Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" and choose "Business" type
3. Fill in app details and create the app

### Step 2: Add Products
1. In the app dashboard, click "Add a Product"
2. Add "Facebook Login"
3. Add "Instagram Basic Display" (for Instagram integration)

### Step 3: Configure Facebook Login
1. Go to Facebook Login → Settings
2. Add valid OAuth redirect URIs:
   - `http://localhost:3000/auth/facebook/callback` (development)
   - `https://yourdomain.com/auth/facebook/callback` (production)

### Step 4: Configure Instagram Basic Display
1. Go to Instagram Basic Display → Basic Display
2. Add redirect URIs:
   - `http://localhost:3000/auth/instagram/callback` (development)
   - `https://yourdomain.com/auth/instagram/callback` (production)

### Step 5: Get Credentials
1. Go to Settings → Basic
2. Copy the App ID and App Secret
3. Add to your `.env` file:
```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

### Step 6: App Review (Production)
For production use, submit your app for review to access public data.

## YouTube Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing if required

### Step 2: Enable YouTube Data API
1. Go to APIs & Services → Library
2. Search for "YouTube Data API v3"
3. Click and enable the API

### Step 3: Create OAuth 2.0 Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/youtube/callback` (development)
   - `https://yourdomain.com/auth/youtube/callback` (production)

### Step 4: Configure OAuth Consent Screen
1. Go to APIs & Services → OAuth consent screen
2. Fill in required information
3. Add test users for development

### Step 5: Get Credentials
1. Download the OAuth 2.0 client configuration
2. Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

## WhatsApp Business API Setup

### Step 1: WhatsApp Business Account
1. Create a WhatsApp Business Account
2. Verify your business

### Step 2: Meta Business Manager
1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Add your WhatsApp Business Account
3. Create a business app

### Step 3: WhatsApp Business API
1. Add WhatsApp product to your app
2. Complete the configuration steps
3. Get your phone number ID and business account ID

### Step 4: Get Access Token
1. Generate a temporary access token for testing
2. For production, implement the authentication flow
3. Add to your `.env` file:
```env
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
```

### Step 5: Webhook Setup (Optional)
1. Configure webhook URL for real-time updates
2. Verify webhook with challenge/verify token

## Testing the Integrations

### Facebook/Instagram
1. Use the Facebook Graph API Explorer to test permissions
2. Ensure your app has the required scopes:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`

### YouTube
1. Test with the YouTube API Explorer
2. Required scopes:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube.readonly`

### WhatsApp Business
1. Use the WhatsApp Business API test number
2. Send test messages to verify integration

## Important Notes

### Rate Limits
- **Facebook**: 200 calls per hour per user
- **Instagram**: 200 calls per hour per user  
- **YouTube**: 10,000 quota units per day
- **WhatsApp**: 1,000 messages per day (test number)

### Permissions
Make sure to request only the necessary permissions for your use case.

### Production Considerations
- Store credentials securely (environment variables, secret managers)
- Implement proper error handling for API failures
- Monitor API usage and quotas
- Set up proper logging for debugging

### Security Best Practices
- Never expose API secrets in client-side code
- Use HTTPS in production
- Implement proper token refresh mechanisms
- Regularly rotate credentials