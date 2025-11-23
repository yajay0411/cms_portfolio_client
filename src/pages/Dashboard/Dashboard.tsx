import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      {/* Header with greeting */}
      <Stack
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        mb={4}>
        <Typography
          variant="h3"
          fontWeight={700}>
          DASHBOARD
        </Typography>
      </Stack>
    </Box>
  );
};

export default Dashboard;
