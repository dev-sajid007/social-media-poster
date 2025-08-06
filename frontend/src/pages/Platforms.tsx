import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Platforms: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Connected Platforms
      </Typography>
      
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Facebook</Typography>
          <Typography variant="body2" color="textSecondary">
            Connect your Facebook pages
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Instagram</Typography>
          <Typography variant="body2" color="textSecondary">
            Connect your Instagram account
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">YouTube</Typography>
          <Typography variant="body2" color="textSecondary">
            Connect your YouTube channel
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">WhatsApp Business</Typography>
          <Typography variant="body2" color="textSecondary">
            Connect WhatsApp Business API
          </Typography>
        </Paper>
      </Box>
      
      <Box mt={3}>
        <Typography variant="body1" color="textSecondary">
          Platform connection and management functionality will be implemented here.
          This will include OAuth flows for each platform and connection status.
        </Typography>
      </Box>
    </Box>
  );
};

export default Platforms;