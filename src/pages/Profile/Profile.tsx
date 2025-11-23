import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Profile: React.FC = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={600}
        mb={4}>
        Profile Settings
      </Typography>
    </Box>
  );
};

export default Profile;
