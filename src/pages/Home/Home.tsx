import { useAuthActions } from '@contexts/auth/hooks/use-auth-actions';
import { api } from '@libs/Axios.Config';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthApiService from '@services/api/auth.api.service';
import { useEffect } from 'react';

export default function Home() {
  const { logout } = useAuthActions();
  useEffect(() => {
    const getUsers = () => {
      try {
        api.get('/users');
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthApiService.logout();
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="2">
      <Box
        mt={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center">
        <Typography
          variant="h3"
          fontWeight={700}>
          Home
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
}
