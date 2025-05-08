import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Avatar,
  Typography,
  Divider,
  Button,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  SpaceDashboard,
  AccountCircle,
  RateReview,
  DarkMode,
  LightMode,
  FamilyRestroom,
  SportsBasketball, 
  Book,
  Code,
  Assignment,
  School
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(1),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    direction: 'rtl',
  },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: 'relative',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(1),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: 24,
    transition: 'all 0.2s ease-in-out',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.dark,
    }
  },
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const menuItems = [
    {
      title: 'داشبورد',
      path: '/dashboard',
      icon: <SpaceDashboard sx={{ color: '#2196f3' }} />
    },
    {
      title: 'پروفایل کاربری',
      path: '/profile',
      icon: <AccountCircle sx={{ color: '#9c27b0' }} />
    },
    {
      title: 'کارهای خانوادگی',
      path: '/family-tasks',
      icon: <FamilyRestroom sx={{ color: '#e91e63' }} />
    },
    {
      title: 'فعالیت‌های ورزشی',
      path: '/sports',
      icon: <SportsBasketball sx={{ color: '#4caf50' }} />
    },
    {
      title: 'مطالعات',
      path: '/studies',
      icon: <Book sx={{ color: '#ff9800' }} />
    },
    {
      title: 'برنامه‌نویسی',
      path: '/coding',
      icon: <Code sx={{ color: '#795548' }} />
    },
    {
      title: 'کارهای مسئولیتی',
      path: '/tasks',
      icon: <Assignment sx={{ color: '#607d8b' }} />
    },
    {
      title: 'برنامه تحصیلی',
      path: '/academic',
      icon: <School sx={{ color: '#9c27b0' }} />
    },
    {
      title: 'ارسال بازخورد',
      path: '/feedback',
      icon: <RateReview sx={{ color: '#f44336' }} />
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <StyledDrawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
    >
      <DrawerHeader>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>

      <ProfileSection>
        <Tooltip title={darkMode ? "حالت روشن" : "حالت تاریک"}>
          <ThemeToggle onClick={toggleDarkMode}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </ThemeToggle>
        </Tooltip>

        <StyledAvatar src={user?.profileImage} alt={user?.name} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {user?.email}
        </Typography>
        <Button
          color="inherit"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          خروج
        </Button>
      </ProfileSection>

      <Divider />

      <List>
        {menuItems.map((item, index) => (
          <StyledListItem
            button
            key={index}
            onClick={() => handleNavigate(item.path)}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: 500
              }}
            />
          </StyledListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;