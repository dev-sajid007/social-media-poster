# Social Media Posting Application

A modern, comprehensive social media management platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Dashboard
- **Overview Statistics**: Track total posts, reach, engagement rate, and scheduled posts
- **Recent Posts Timeline**: View latest published and scheduled content
- **Connected Accounts Status**: Monitor platform connections at a glance
- **Quick Actions**: Fast access to compose, upload, analytics, and account management

### Post Composer
- **Rich Text Editor**: Create engaging content with formatting options
- **Multi-Platform Publishing**: Support for Facebook, Instagram, WhatsApp, and YouTube
- **Media Upload**: Drag & drop interface for images, videos, and GIFs
- **Character Count Tracking**: Platform-specific character limits
- **Scheduling**: Post immediately or schedule for optimal times
- **Platform Preview**: See how content appears on different platforms

### Analytics Dashboard
- **Engagement Metrics**: Track likes, comments, shares, and reach
- **Platform Performance**: Compare performance across social networks
- **Best Posting Times**: Data-driven recommendations for optimal posting
- **Performance Charts**: Visual insights with interactive charts
- **Key Insights & Recommendations**: AI-powered suggestions for content strategy

### Media Library
- **Grid & List Views**: Flexible file browsing options
- **File Management**: Upload, organize, and delete media files
- **File Type Support**: Images (JPG, PNG, GIF), Videos (MP4), and GIFs
- **Metadata Display**: File size, dimensions, upload date, and usage tracking
- **Search & Filter**: Find files by name, type, or usage
- **Bulk Actions**: Select and manage multiple files

### Account Management
- **Platform Connections**: Manage Facebook, Instagram, WhatsApp, and YouTube accounts
- **Status Indicators**: Visual status for connected, expired, and disconnected accounts
- **Account Details**: Follower counts, last sync times, and account types
- **Refresh & Reconnect**: Maintain active connections with one-click refresh

## 🎨 Design System

### Color Palette
- **Primary**: Twitter Blue (#1DA1F2) - Main brand color
- **Secondary**: Modern Purple (#6366F1) - Accent color
- **Success**: Green (#10B981) - Connected accounts, positive metrics
- **Warning**: Orange (#F59E0B) - Pending actions, alerts
- **Error**: Red (#EF4444) - Errors, disconnected accounts
- **Grayscale**: Complete spectrum from white to dark gray

### Typography
- **Font Family**: Inter - Modern, readable system font
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Sizes**: 12px to 48px with consistent scaling

### Components
- **Buttons**: Primary, secondary, outline, and ghost variants
- **Cards**: Clean containers with consistent padding and shadows
- **Badges**: Status indicators with color-coded variants
- **Inputs**: Focused states with proper validation styling

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Collapsible Sidebar**: Hamburger menu for mobile navigation
- **Touch-Friendly**: Optimized button sizes and interaction areas
- **Stacked Layouts**: Content reflows gracefully on smaller screens

### Accessibility Features
- **ARIA Labels**: Proper semantic markup for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: WCAG-compliant color ratios
- **Focus Indicators**: Clear visual focus states

## 🛠 Technical Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with full IntelliSense
- **Vite**: Fast development server and optimized builds
- **Tailwind CSS**: Utility-first CSS framework

### UI Components
- **Heroicons**: Beautiful SVG icons
- **Lucide React**: Additional icon library
- **Recharts**: Interactive data visualization
- **Class Variance Authority**: Type-safe component variants

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dev-sajid007/social-media-poster.git
   cd social-media-poster/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # Base UI components
│   │   ├── layout/      # Layout components
│   │   ├── forms/       # Form components
│   │   ├── charts/      # Chart components
│   │   └── icons/       # Custom icons
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── dist/                # Production build
```

## 🎯 Key Features Implemented

### ✅ Dashboard Layout
- Clean, modern sidebar navigation
- Main content area with post composer
- Connected accounts status panel
- Recent posts timeline
- Analytics widgets

### ✅ Post Composer Interface
- Rich text editor with formatting options
- Media upload area with drag & drop
- Platform selection checkboxes
- Character count for each platform
- Scheduling options with date/time picker

### ✅ Account Management
- Connected accounts grid with status indicators
- Add/remove account buttons
- Account settings and permissions
- Refresh token status

### ✅ Content Management
- Media library with grid layout
- Search and filter options
- Bulk actions interface
- File type indicators

### ✅ Analytics Dashboard
- Engagement metrics charts
- Platform-wise performance
- Best posting times suggestions
- Reach and impression statistics

## 🔮 Future Enhancements

- **Real-time Notifications**: Push notifications for post performance
- **Advanced Scheduling**: Bulk scheduling and content calendar
- **Team Collaboration**: Multi-user support with role-based permissions
- **AI Content Suggestions**: Automated content recommendations
- **Advanced Analytics**: Custom date ranges and export options
- **Template Library**: Pre-built post templates for different industries
- **Integration Expansions**: LinkedIn, TikTok, Twitter support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by the Social Media Poster team