import Box from '@mui/material/Box';
import Sidebar from '@components/Sidebar/Sidebar';
import { Paper } from '@mui/material';
import useIsMobile from '@hooks/useIsMobile';

interface ILayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <Sidebar isMobile={isMobile} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          height: 'fit-content',
          minHeight: '100%',
          padding: isMobile ? ' 52px 8px 8px' : '16px',
        }}
      >
        <Paper
          sx={{
            padding: isMobile ? '8px' : '16px',
            height: 'auto',
            minHeight: isMobile ? '100vh' : '96vh',
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
