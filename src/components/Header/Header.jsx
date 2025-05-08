import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Button,
  Tooltip,
  Badge
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogoutRounded,
  SpaceDashboard,
  Dashboard,
  Notifications,
  Settings,
  FamilyRestroom,
  SportsBasketball,
  Book,
  Code,
  Assignment, 
  School
} from '@mui/icons-material';
import axios from 'axios';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? '#0A1929' 
    : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.common.white, 0.1)
    : alpha(theme.palette.primary.main, 0.1),
  height: 56,
  [theme.breakpoints.up('sm')]: {
    height: 72,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  direction: 'rtl',
  padding: theme.spacing(0.5, 2),
  minHeight: 56,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0.5, 6),
    minHeight: 72,
  },
}));

const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius * 2,
  color: active 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' 
      ? theme.palette.common.white 
      : theme.palette.text.primary,
  backgroundColor: active 
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.08) 
    : 'transparent',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.12)
      : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.04),
  },
  '& .MuiButton-startIcon': {
    marginLeft: theme.spacing(1),
    marginRight: -theme.spacing(0.5),
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' 
    ? theme.palette.common.white 
    : theme.palette.text.secondary,
  padding: 8,
  fontSize: '1.2rem',
}));

const Logo = styled('img')({
  height: 28,
  width: 'auto',
  cursor: 'pointer',
  display: 'none',
  '@media (min-width: 600px)': {
    display: 'block',
    height: 45,
  },
});

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications/unread-count/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      title: 'داشبورد',
      path: '/dashboard', 
      icon: <SpaceDashboard />
    },
    {
      title: 'کارهای خانوادگی',
      path: '/family-tasks',
      icon: <FamilyRestroom />
    },
    {
      title: 'فعالیت‌های ورزشی', 
      path: '/sports',
      icon: <SportsBasketball />
    },
    {
      title: 'مطالعات',
      path: '/studies',
      icon: <Book />
    },
    {
      title: 'برنامه‌نویسی',
      path: '/coding',
      icon: <Code />
    },
    {
      title: 'کارهای مسئولیتی',
      path: '/tasks',
      icon: <Assignment />
    },
    {
      title: 'برنامه تحصیلی',
      path: '/academic',
      icon: <School />
    }
  ];
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={user?.profileImage}
            alt={user?.name}
            onClick={onMenuClick}
            sx={{
              width: 32,
              height: 32,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: alpha('#1976d2', 0.2),
            }}
          />
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}
            >
              {user?.name || 'کاربر مهمان'}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              خوش آمدید
            </Typography>
          </Box>
        </Box>

        <NavigationContainer>
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              active={location.pathname === item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </NavButton>
          ))}
        </NavigationContainer>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="اعلان‌ها">
            <ActionButton onClick={() => navigate('/notifications')}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                invisible={loading || unreadCount === 0}
              >
                <Notifications sx={{ fontSize: 20 }} />
              </Badge>
            </ActionButton>
          </Tooltip>

          <Tooltip title="تنظیمات">
            <ActionButton onClick={() => navigate('/profile')}>
              <Settings sx={{ fontSize: 20 }} />
            </ActionButton>
          </Tooltip>

          <Tooltip title="خروج">
            <ActionButton
              onClick={logout}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha('#f44336', 0.08),
                }
              }}
            >
              <LogoutRounded sx={{ fontSize: 20 }} />
            </ActionButton>
          </Tooltip>

          <Tooltip title="داشبورد">
            <ActionButton 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                display: { xs: 'flex', sm: 'none' }
              }}
            >
              <Dashboard sx={{ fontSize: 20 }} />
            </ActionButton>
          </Tooltip>

          <Logo
            src="https://uploadkon.ir/uploads/6bfa29_25لوگو-شیفت-بند.png"
            alt="Logo"
            onClick={() => navigate('/dashboard')}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          />
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;