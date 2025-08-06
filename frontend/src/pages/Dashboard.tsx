import React from 'react';
import { 
  PlusIcon,
  ChartBarIcon,
  PhotoIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface QuickStatProps {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend?: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ title, value, icon: Icon, color, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-success-600 mt-1">{trend}</p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const recentPosts = [
  {
    id: '1',
    content: 'Excited to announce our new product launch! 🚀',
    platforms: ['Facebook', 'Instagram'],
    status: 'published',
    publishTime: '2 hours ago',
    engagement: { likes: 124, comments: 23, shares: 12 }
  },
  {
    id: '2',
    content: 'Behind the scenes of our latest photoshoot...',
    platforms: ['Instagram'],
    status: 'scheduled',
    publishTime: 'Tomorrow at 3:00 PM',
    engagement: null
  },
  {
    id: '3',
    content: 'Thank you to all our amazing customers for the support!',
    platforms: ['Facebook', 'WhatsApp'],
    status: 'published',
    publishTime: '1 day ago',
    engagement: { likes: 89, comments: 15, shares: 8 }
  }
];

const connectedAccounts = [
  { platform: 'Facebook', icon: '📘', status: 'connected', username: '@mybusiness' },
  { platform: 'Instagram', icon: '📷', status: 'connected', username: '@mycompany' },
  { platform: 'WhatsApp', icon: '💬', status: 'expired', username: '+1234567890' },
  { platform: 'YouTube', icon: '📹', status: 'disconnected', username: '@mychannel' }
];

const upcomingPosts = [
  { time: 'Today, 3:00 PM', content: 'Weekly product showcase', platforms: ['Facebook', 'Instagram'] },
  { time: 'Tomorrow, 9:00 AM', content: 'Customer success story', platforms: ['Instagram'] },
  { time: 'Friday, 2:00 PM', content: 'Weekend special offer', platforms: ['Facebook', 'WhatsApp'] }
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [showComposer, setShowComposer] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your social media.</p>
        </div>
        <Button onClick={() => onNavigate('compose')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStat
          title="Total Posts"
          value="147"
          icon={PhotoIcon}
          color="bg-blue-500"
          trend="+12% this week"
        />
        <QuickStat
          title="Total Reach"
          value="45.2K"
          icon={UserGroupIcon}
          color="bg-green-500"
          trend="+8% this week"
        />
        <QuickStat
          title="Engagement Rate"
          value="6.8%"
          icon={ChartBarIcon}
          color="bg-purple-500"
          trend="+2.1% this week"
        />
        <QuickStat
          title="Scheduled Posts"
          value="23"
          icon={CalendarDaysIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-2">{post.content}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        {post.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{post.publishTime}</span>
                        {post.engagement && (
                          <>
                            <span>•</span>
                            <span>{post.engagement.likes} likes</span>
                            <span>•</span>
                            <span>{post.engagement.comments} comments</span>
                            <span>•</span>
                            <span>{post.engagement.shares} shares</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={post.status === 'published' ? 'success' : 'secondary'}
                      className="ml-4"
                    >
                      {post.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">View All Posts</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedAccounts.map((account) => (
                <div key={account.platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{account.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{account.platform}</p>
                      <p className="text-xs text-gray-500">{account.username}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      account.status === 'connected' ? 'success' : 
                      account.status === 'expired' ? 'warning' : 'error'
                    }
                    className="text-xs"
                  >
                    {account.status}
                  </Badge>
                </div>
              ))}
              <div className="text-center pt-3">
                <Button variant="outline" size="sm" onClick={() => onNavigate('accounts')}>
                  Manage Accounts
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingPosts.map((post, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">{post.time}</p>
                    <p className="text-sm text-gray-900 truncate">{post.content}</p>
                    <div className="flex space-x-1 mt-1">
                      {post.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-3">
                <Button variant="outline" size="sm">View Schedule</Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('compose')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('media')}>
                <PhotoIcon className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('analytics')}>
                <ChartBarIcon className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('accounts')}>
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Manage Accounts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};