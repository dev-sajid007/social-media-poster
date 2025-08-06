# Social Media Poster

A comprehensive web application that allows users to post content to multiple social media platforms including Facebook, Instagram, YouTube, and WhatsApp Business using their respective APIs.

## Features

### Core Features
- **Multi-Platform Posting**: Post to Facebook, Instagram, YouTube, and WhatsApp Business
- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Content Management**: Rich text editing, media upload, and post scheduling
- **Analytics Dashboard**: Track engagement across all platforms
- **Platform Integration**: OAuth flows for Facebook, Instagram, and YouTube

### Technical Stack

#### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Multer** for file uploads
- **Rate limiting** and security middleware

#### Frontend
- **React** with TypeScript
- **Material-UI** for modern UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication

## Project Structure

```
/
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication, error handling
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Platform integrations
│   │   └── utils/           # Database utilities
│   ├── uploads/             # File storage
│   └── package.json
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── store/           # Redux store and slices
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── docs/                    # Documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd social-media-poster
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Configuration
1. Copy the environment example file:
```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/social-media-poster

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Facebook/Meta API
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Google/YouTube API
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
```

#### Frontend Configuration
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

#### Production Build

1. Build the backend:
```bash
cd backend
npm run build
npm start
```

2. Build the frontend:
```bash
cd frontend
npm run build
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Posts Endpoints
- `GET /api/posts` - Get user posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post immediately

### Platform Endpoints
- `POST /api/platforms/facebook/connect` - Connect Facebook
- `POST /api/platforms/instagram/connect` - Connect Instagram
- `GET /api/platforms/youtube/auth-url` - Get YouTube auth URL
- `POST /api/platforms/youtube/connect` - Connect YouTube
- `POST /api/platforms/whatsapp/connect` - Connect WhatsApp Business
- `GET /api/platforms/connected` - Get connected platforms
- `DELETE /api/platforms/:platform/disconnect` - Disconnect platform

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/schedule` - Get posting schedule
- `PUT /api/users/change-password` - Change password

## Platform Setup

### Facebook/Instagram
1. Create a Facebook App at https://developers.facebook.com/
2. Add Facebook Login and Instagram Basic Display products
3. Configure OAuth redirect URIs
4. Get App ID and App Secret

### YouTube
1. Create a project in Google Cloud Console
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs

### WhatsApp Business
1. Set up WhatsApp Business API
2. Get access token and phone number ID
3. Configure webhook endpoints

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- File upload restrictions

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection strings
- API keys and secrets
- JWT secrets
- CORS origins

### Recommended Deployment Options
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: MongoDB Atlas, AWS DocumentDB

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.