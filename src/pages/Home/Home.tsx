import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <Box m="2">
      <Box
        mt={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3" fontWeight={700}>
          Home
        </Typography>
      </Box>
    </Box>
  );
}
