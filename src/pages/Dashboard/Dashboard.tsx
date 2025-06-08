import React, { useState, useEffect } from 'react';

import { useAppContext } from '../../contexts/app.context';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Dashboard: React.FC = () => {
  // Replace with actual data fetching
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPortfolios: 0,
    activePortfolios: 0,
    inactivePortfolios: 0,
    userName: 'User',
  });

  const { user } = useAppContext();

  // Simulate data fetching
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // This would be your actual API calls
      // const userData = await fetchUserData();
      // const portfolioData = await fetchPortfolioData();

      // Simulated data
      setStats({
        totalUsers: 256,
        totalPortfolios: 542,
        activePortfolios: 389,
        inactivePortfolios: 153,
        userName: user?.name || 'User',
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header with greeting */}
      <Stack
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        mb={4}
      >
        <Typography variant="h3" fontWeight={700}>
          DASHBOARD
        </Typography>
      </Stack>
      <Stack
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        mb={4}
      >
        <Typography
          variant="h5"
          color="secondary"
          fontSize={30}
          fontWeight={600}
        >
          {getGreeting()}, {stats.userName}!
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          fontSize={30}
          fontWeight={`600`}
        >
          {'Role: ' + 'Admin'}
        </Typography>
      </Stack>

      {/* Stats Cards */}
      <Stack
        display="flex"
        direction="row"
        gap={2}
        justifyContent={['center', 'flex-start']}
        alignItems={'center'}
        flexWrap="wrap"
      >
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<AccountCircleIcon sx={{ fontSize: 40 }} />}
          color="#3f51b5"
        />
        <StatCard
          title="Total Portfolios"
          value={stats.totalPortfolios}
          icon={<FolderIcon sx={{ fontSize: 40 }} />}
          color="#f50057"
        />
        <StatCard
          title="Active Portfolios"
          value={stats.activePortfolios}
          icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
          color="#4caf50"
        />
        <StatCard
          title="Inactive Portfolios"
          value={stats.inactivePortfolios}
          icon={<CancelIcon sx={{ fontSize: 40 }} />}
          color="#ff9800"
        />
      </Stack>
    </Box>
  );
};

export default Dashboard;

// Component for stat cards
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Divider />
        <Box pt={2} textAlign="center">
          <Typography variant="h3" fontWeight={700}>
            {value.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
