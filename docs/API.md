# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | array,
  "error": {
    "message": "string"
  }
}
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login User
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Refresh Token
**POST** `/auth/refresh`

Request body:
```json
{
  "refreshToken": "refresh_token"
}
```

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer <token>`

### Logout
**POST** `/auth/logout`

Headers: `Authorization: Bearer <token>`

## Posts Endpoints

### Get Posts
**GET** `/posts`

Query parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `platform` (optional): Filter by platform

### Create Post
**POST** `/posts`

Content-Type: `multipart/form-data`

Form fields:
- `content`: Post content (required)
- `platforms`: Array of platform names (required)
- `scheduledFor`: ISO date string (optional)
- `media`: Files (optional, max 10 files)

### Get Single Post
**GET** `/posts/:id`

### Update Post
**PUT** `/posts/:id`

Request body:
```json
{
  "content": "Updated content",
  "scheduledFor": "2024-01-01T12:00:00Z"
}
```

### Delete Post
**DELETE** `/posts/:id`

### Publish Post
**POST** `/posts/:id/publish`

## Platform Connection Endpoints

### Connect Facebook
**POST** `/platforms/facebook/connect`

Request body:
```json
{
  "code": "facebook_auth_code",
  "redirectUri": "https://your-app.com/callback"
}
```

### Connect Instagram
**POST** `/platforms/instagram/connect`

Request body:
```json
{
  "code": "facebook_auth_code",
  "redirectUri": "https://your-app.com/callback"
}
```

### Get YouTube Auth URL
**GET** `/platforms/youtube/auth-url`

### Connect YouTube
**POST** `/platforms/youtube/connect`

Request body:
```json
{
  "code": "google_auth_code"
}
```

### Connect WhatsApp Business
**POST** `/platforms/whatsapp/connect`

Request body:
```json
{
  "accessToken": "whatsapp_access_token",
  "phoneNumberId": "phone_number_id",
  "businessAccountId": "business_account_id"
}
```

### Get Connected Platforms
**GET** `/platforms/connected`

### Disconnect Platform
**DELETE** `/platforms/:platform/disconnect`

Platform options: `facebook`, `instagram`, `youtube`, `whatsapp`

## User Endpoints

### Get User Profile
**GET** `/users/profile`

### Update User Profile
**PUT** `/users/profile`

Request body:
```json
{
  "name": "Updated Name",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "timezone": "UTC",
    "defaultPlatforms": ["facebook", "instagram"],
    "autoScheduling": true
  }
}
```

### Get Dashboard Data
**GET** `/users/dashboard`

### Get Posting Schedule
**GET** `/users/schedule`

Query parameters:
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

### Change Password
**PUT** `/users/change-password`

Request body:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`