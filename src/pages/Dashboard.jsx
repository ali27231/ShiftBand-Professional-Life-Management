
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  FamilyRestroom as FamilyIcon,
  SportsBasketball as SportsIcon,
  Book as BookIcon, 
  Code as CodeIcon,
  School as SchoolIcon,
  Assignment as TaskIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import moment from 'moment-jalaali';
import api from '../services/api';

const GlowingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  background: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : '#fff',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha('#fff', 0.2),
  '& svg': {
    fontSize: 24,
    color: '#fff'
  }
}));

const NotificationBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  background: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:last-child': {
    marginBottom: 0
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
  borderRadius: 24,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 20px 30px -10px ${alpha(theme.palette.primary.main, 0.3)}`
      : `0 20px 30px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
  }
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, notificationsResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/notifications')
      ]);
      setStats(statsResponse.data);
      setNotifications(notificationsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activityStats = [
    {
      title: 'کارهای خانوادگی',
      value: stats?.familyTasks || 0,
      icon: <FamilyIcon />,
      color: '#4CAF50',
      path: '/family-tasks'
    },
    {
      title: 'فعالیت‌های ورزشی',
      value: stats?.sportsActivities || 0,
      icon: <SportsIcon />,
      color: '#FF9800',
      path: '/sports'
    },
    {
      title: 'مطالعات',
      value: stats?.readingHours || 0,
      icon: <BookIcon />,
      color: '#2196F3',
      path: '/studies'
    },
    {
      title: 'پروژه‌های برنامه‌نویسی',
      value: stats?.codingProjects || 0,
      icon: <CodeIcon />,
      color: '#9C27B0',
      path: '/coding'
    },
    {
      title: 'کارهای مسئولیتی',
      value: stats?.responsibilities || 0,
      icon: <TaskIcon />,
      color: '#F44336',
      path: '/tasks'
    },
    {
      title: 'برنامه تحصیلی',
      value: stats?.academicTasks || 0,
      icon: <SchoolIcon />,
      color: '#3F51B5',
      path: '/academic'
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box p={4} dir="rtl">
      <GlowingText variant="h4" gutterBottom sx={{ 
        fontWeight: 800,
        mb: 4,
        fontSize: { xs: '1.8rem', md: '2.4rem' },
        letterSpacing: '-0.5px'
      }}>
        سلام {user?.name}، خوش آمدید ✨
      </GlowingText>

      <Grid container spacing={4}>
        {activityStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard 
              elevation={darkMode ? 0 : 2} 
              sx={{ background: `linear-gradient(135deg, ${alpha(stat.color, 0.8)} 0%, ${alpha(stat.color, 0.9)} 100%)` }}
              onClick={() => handleCardClick(stat.path)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight={600}>{stat.title}</Typography>
                  <IconWrapper>
                    {stat.icon}
                  </IconWrapper>
                </Box>
                <Typography variant="h3" fontWeight={800}>{stat.value}</Typography>
              </CardContent>
            </StatCard>
          </Grid>
        ))}

        <Grid item xs={12}>
          <StyledPaper elevation={darkMode ? 0 : 1}>
            <Box display="flex" alignItems="center" mb={3}>
              <NotificationsIcon sx={{ ml: 2, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>اعلان‌ها</Typography>
            </Box>
            {notifications.map((notification, index) => (
              <NotificationBox key={index}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    {notification.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ 
                      fontSize: '0.9rem',
                      opacity: 0.8,
                      fontWeight: 400 
                    }}
                  >
                    {moment(notification.date).fromNow()}
                  </Typography>
                </Box>
              </NotificationBox>
            ))}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
