import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Sidebar from '@components/Sidebar/Sidebar';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Stack direction={false ? 'column' : 'row'} p={2}>
        <Sidebar />
        <Paper
          sx={{
            borderRadius: 2,
            paddingX: 5,
            paddingY: 2,
            width: '100%',
            height: '100%',
            minHeight: '96vh',
          }}
        >
          {children}
        </Paper>
      </Stack>
    </Box>
  );
};
export default Layout;
