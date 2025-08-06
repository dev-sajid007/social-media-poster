import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CreatePost: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Post creation functionality will be implemented here.
          This will include:
          - Rich text editor for post content
          - File upload for images and videos
          - Platform selection
          - Scheduling options
          - Preview functionality
        </Typography>
      </Paper>
    </Box>
  );
};

export default CreatePost;