import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';

const Posts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/posts/create')}
        >
          Create New Post
        </Button>
      </Box>
      
      <Typography variant="body1" color="textSecondary">
        Posts management functionality will be implemented here.
        This will include viewing all posts, filtering by status and platform,
        editing scheduled posts, and viewing analytics.
      </Typography>
    </Box>
  );
};

export default Posts;