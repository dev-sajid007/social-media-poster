# Deployment Guide

This guide covers deploying the Social Media Poster application to various platforms.

## Environment Setup

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-poster
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com

# Facebook/Meta API
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Google/YouTube API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-api-domain.com/api/auth/google/callback

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
```

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Set up database user and password
4. Whitelist IP addresses or use 0.0.0.0/0 for all IPs
5. Get connection string and add to MONGODB_URI

### Self-hosted MongoDB
1. Install MongoDB on your server
2. Configure authentication
3. Set up replica set for production
4. Update connection string

## Backend Deployment

### Option 1: Heroku
1. Install Heroku CLI
2. Create new Heroku app:
```bash
cd backend
heroku create your-app-name-api
```

3. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... add all other env vars
```

4. Deploy:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Set environment variables in the dashboard
4. Deploy

### Option 3: AWS EC2
1. Launch EC2 instance with Ubuntu
2. Install Node.js and PM2:
```bash
sudo apt update
sudo apt install nodejs npm
sudo npm install -g pm2
```

3. Clone repository and install dependencies:
```bash
git clone your-repo-url
cd social-media-poster/backend
npm install
npm run build
```

4. Create PM2 ecosystem file:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'social-media-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

5. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. Set up Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Frontend Deployment

### Option 1: Netlify
1. Build the project:
```bash
cd frontend
npm run build
```

2. Connect GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Set environment variables in Netlify dashboard
5. Deploy

### Option 2: Vercel
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

3. Set environment variables in Vercel dashboard

### Option 3: AWS S3 + CloudFront
1. Build the project:
```bash
cd frontend
npm run build
```

2. Create S3 bucket for static hosting
3. Upload build files to S3
4. Configure CloudFront distribution
5. Set up custom domain with Route 53

## SSL/TLS Setup

### Let's Encrypt (Free)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### CloudFlare (Recommended)
1. Add your domain to CloudFlare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Set SSL mode to "Full (strict)"

## Monitoring and Logging

### Application Monitoring
1. Set up error tracking with Sentry:
```bash
npm install @sentry/node
```

2. Configure in your app:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN"
});
```

### Uptime Monitoring
- Use services like UptimeRobot or Pingdom
- Monitor both frontend and API endpoints

### Log Management
- Use PM2 logs for basic logging
- Consider ELK stack or Datadog for advanced logging

## Performance Optimization

### Backend
- Enable gzip compression
- Implement Redis caching
- Optimize database queries
- Use CDN for file uploads

### Frontend
- Enable gzip compression
- Implement code splitting
- Optimize images
- Use service workers for caching

## Security Checklist

### Backend Security
- [ ] Environment variables properly set
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection headers
- [ ] HTTPS enforced

### Database Security
- [ ] Database authentication enabled
- [ ] Network access restricted
- [ ] Regular backups configured
- [ ] Data encryption at rest

### Infrastructure Security
- [ ] Firewall configured
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Access logs monitored

## Backup Strategy

### Database Backups
1. Set up automated MongoDB backups
2. Store backups in multiple locations
3. Test backup restoration regularly

### Code Backups
1. Use version control (Git)
2. Create release tags
3. Maintain deployment scripts

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: |
          cd backend
          npm install
      - name: Build
        run: |
          cd backend
          npm run build
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Check frontend URL in backend CORS configuration
2. **Database connection issues**: Verify MongoDB URI and network access
3. **API key errors**: Ensure all environment variables are set correctly
4. **File upload issues**: Check file size limits and storage configuration

### Debugging
1. Check application logs
2. Monitor API responses
3. Use browser developer tools
4. Test API endpoints with Postman