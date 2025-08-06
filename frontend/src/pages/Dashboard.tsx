import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  PostAdd as PostAddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewsIcon,
  ThumbUp as LikesIcon,
  Comment as CommentsIcon,
  Share as SharesIcon,
} from '@mui/icons-material';
import { DashboardData } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response: any = await apiService.getDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          Failed to load dashboard data
        </Typography>
      </Box>
    );
  }

  const { overview, recentPosts, platformStats } = dashboardData;

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4">
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<PostAddIcon />}
          onClick={() => navigate('/posts/create')}
        >
          Create Post
        </Button>
      </Box>

      {/* Stats Overview */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3} mb={3}>
        <StatCard
          title="Total Posts"
          value={overview.totalPosts}
          icon={<PostAddIcon />}
          color="#1976d2"
        />
        <StatCard
          title="Scheduled Posts"
          value={overview.scheduledPosts}
          icon={<ScheduleIcon />}
          color="#ed6c02"
        />
        <StatCard
          title="Posted Today"
          value={overview.postedToday}
          icon={<TrendingUpIcon />}
          color="#2e7d32"
        />
        <StatCard
          title="Total Views"
          value={overview.totalEngagement.views}
          icon={<ViewsIcon />}
          color="#9c27b0"
        />
      </Box>

      {/* Engagement Stats */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3} mb={3}>
        <StatCard
          title="Total Likes"
          value={overview.totalEngagement.likes}
          icon={<LikesIcon />}
          color="#f44336"
        />
        <StatCard
          title="Total Comments"
          value={overview.totalEngagement.comments}
          icon={<CommentsIcon />}
          color="#ff9800"
        />
        <StatCard
          title="Total Shares"
          value={overview.totalEngagement.shares}
          icon={<SharesIcon />}
          color="#4caf50"
        />
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        {/* Recent Posts */}
        <Box flex={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Posts
              </Typography>
              {recentPosts.length === 0 ? (
                <Typography color="textSecondary">
                  No posts yet. Create your first post to get started!
                </Typography>
              ) : (
                <List>
                  {recentPosts.map((post) => (
                    <ListItem key={post._id} divider>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="body1" noWrap>
                              {post.content.substring(0, 100)}
                              {post.content.length > 100 ? '...' : ''}
                            </Typography>
                            <Box mt={1}>
                              <Chip
                                label={post.status}
                                size="small"
                                color={
                                  post.status === 'posted'
                                    ? 'success'
                                    : post.status === 'failed'
                                    ? 'error'
                                    : post.status === 'scheduled'
                                    ? 'warning'
                                    : 'default'
                                }
                                sx={{ mr: 1 }}
                              />
                              {post.platforms.map((platform) => (
                                <Chip
                                  key={platform.name}
                                  label={platform.name}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 0.5 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                        secondary={new Date(post.createdAt).toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Platform Stats */}
        <Box flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Performance
              </Typography>
              {platformStats.length === 0 ? (
                <Typography color="textSecondary">
                  No platform data available yet.
                </Typography>
              ) : (
                <Box>
                  {platformStats.map((stat) => {
                    const successRate = stat.totalPosts > 0 
                      ? (stat.successfulPosts / stat.totalPosts) * 100 
                      : 0;
                    
                    return (
                      <Box key={stat._id} mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" textTransform="capitalize">
                            {stat._id}
                          </Typography>
                          <Typography variant="body2">
                            {stat.successfulPosts}/{stat.totalPosts}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={successRate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: successRate > 80 ? '#4caf50' : successRate > 60 ? '#ff9800' : '#f44336'
                            }
                          }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {successRate.toFixed(1)}% success rate
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;