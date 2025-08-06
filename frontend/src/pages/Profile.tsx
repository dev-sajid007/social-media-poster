import React from 'react';
import { Box, Typography, Paper, Avatar, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Avatar 
            src={user?.avatar} 
            sx={{ width: 80, height: 80 }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.email}
            </Typography>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" color="textSecondary">
          Profile management functionality will be implemented here.
          This will include:
          - Edit profile information
          - Change password
          - Account preferences
          - Notification settings
          - Account statistics
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;