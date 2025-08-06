import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

// Mock data for charts
const engagementData = [
  { date: '2024-01-01', likes: 1200, comments: 89, shares: 45, reach: 15000 },
  { date: '2024-01-02', likes: 1450, comments: 95, shares: 52, reach: 18000 },
  { date: '2024-01-03', likes: 1100, comments: 76, shares: 38, reach: 14000 },
  { date: '2024-01-04', likes: 1800, comments: 124, shares: 67, reach: 22000 },
  { date: '2024-01-05', likes: 1650, comments: 118, shares: 59, reach: 20000 },
  { date: '2024-01-06', likes: 1950, comments: 135, shares: 78, reach: 25000 },
  { date: '2024-01-07', likes: 2200, comments: 156, shares: 89, reach: 28000 },
];

const platformData = [
  { platform: 'Facebook', posts: 45, engagement: 2890, reach: 125000, color: '#1877F2' },
  { platform: 'Instagram', posts: 38, engagement: 3245, reach: 98000, color: '#E4405F' },
  { platform: 'WhatsApp', posts: 12, engagement: 567, reach: 23000, color: '#25D366' },
  { platform: 'YouTube', posts: 8, engagement: 1234, reach: 45000, color: '#FF0000' },
];

const bestTimesData = [
  { hour: '6 AM', Monday: 0.2, Tuesday: 0.1, Wednesday: 0.3, Thursday: 0.2, Friday: 0.4, Saturday: 0.1, Sunday: 0.1 },
  { hour: '9 AM', Monday: 0.5, Tuesday: 0.6, Wednesday: 0.7, Thursday: 0.8, Friday: 0.6, Saturday: 0.3, Sunday: 0.2 },
  { hour: '12 PM', Monday: 0.8, Tuesday: 0.9, Wednesday: 0.8, Thursday: 0.7, Friday: 0.5, Saturday: 0.6, Sunday: 0.4 },
  { hour: '3 PM', Monday: 0.9, Tuesday: 0.8, Wednesday: 0.9, Thursday: 0.9, Friday: 0.7, Saturday: 0.8, Sunday: 0.6 },
  { hour: '6 PM', Monday: 1.0, Tuesday: 1.0, Wednesday: 1.0, Thursday: 1.0, Friday: 0.9, Saturday: 1.0, Sunday: 0.9 },
  { hour: '9 PM', Monday: 0.7, Tuesday: 0.8, Wednesday: 0.7, Thursday: 0.6, Friday: 0.8, Saturday: 0.9, Sunday: 0.8 },
];

const postPerformanceData = [
  { name: 'Product Launch', likes: 2400, comments: 180, shares: 95, reach: 35000 },
  { name: 'Behind Scenes', likes: 1890, comments: 145, shares: 67, reach: 28000 },
  { name: 'Customer Story', likes: 2100, comments: 165, shares: 89, reach: 32000 },
  { name: 'Tutorial Video', likes: 3200, comments: 245, shares: 156, reach: 45000 },
  { name: 'Company News', likes: 1450, comments: 98, shares: 45, reach: 22000 },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-error-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-success-600' : 'text-error-600'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500">Track your social media performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <Badge variant="outline" className="flex items-center gap-1">
            <CalendarDaysIcon className="h-3 w-3" />
            Jan 1 - Jan 7, 2024
          </Badge>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Reach"
          value="142K"
          change={12.5}
          icon={EyeIcon}
          color="bg-blue-500"
        />
        <MetricCard
          title="Engagement"
          value="8.2K"
          change={8.3}
          icon={HeartIcon}
          color="bg-pink-500"
        />
        <MetricCard
          title="Comments"
          value="923"
          change={-2.1}
          icon={ChatBubbleLeftIcon}
          color="bg-green-500"
        />
        <MetricCard
          title="Shares"
          value="456"
          change={15.7}
          icon={ShareIcon}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatNumber(value), '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="likes" 
                  stackId="1" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Likes"
                />
                <Area 
                  type="monotone" 
                  dataKey="comments" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Comments"
                />
                <Area 
                  type="monotone" 
                  dataKey="shares" 
                  stackId="1" 
                  stroke="#6366F1" 
                  fill="#6366F1" 
                  fillOpacity={0.6}
                  name="Shares"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="engagement"
                  label={({ platform, percent }) => `${platform} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformData.map((platform) => (
              <div key={platform.platform} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: platform.color }}
                  >
                    <span className="text-white font-bold text-sm">
                      {platform.platform.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{platform.platform}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{platform.posts}</span> posts
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{formatNumber(platform.engagement)}</span> engagement
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{formatNumber(platform.reach)}</span> reach
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Times to Post */}
      <Card>
        <CardHeader>
          <CardTitle>Best Times to Post</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestTimesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Engagement Rate']} />
              <Bar dataKey="Monday" fill="#1DA1F2" />
              <Bar dataKey="Tuesday" fill="#1570a6" />
              <Bar dataKey="Wednesday" fill="#6366F1" />
              <Bar dataKey="Thursday" fill="#5b21b6" />
              <Bar dataKey="Friday" fill="#10B981" />
              <Bar dataKey="Saturday" fill="#059669" />
              <Bar dataKey="Sunday" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postPerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="likes" fill="#EF4444" name="Likes" />
              <Bar dataKey="comments" fill="#10B981" name="Comments" />
              <Bar dataKey="shares" fill="#6366F1" name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Peak Engagement Time</p>
                <p className="text-sm text-gray-600">6 PM on weekdays shows highest engagement rates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-warning-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Content Performance</p>
                <p className="text-sm text-gray-600">Video content performs 40% better than static images</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Platform Growth</p>
                <p className="text-sm text-gray-600">Instagram shows the highest growth rate this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Optimal Posting Schedule</p>
              <p className="text-sm text-blue-700">Post 3-4 times per week between 5-7 PM for maximum reach</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Content Strategy</p>
              <p className="text-sm text-green-700">Focus on video content and behind-the-scenes posts</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Platform Focus</p>
              <p className="text-sm text-purple-700">Increase Instagram activity and engagement initiatives</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};