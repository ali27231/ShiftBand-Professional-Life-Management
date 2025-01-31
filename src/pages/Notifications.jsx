import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  NotificationsActive,
  CheckCircleOutline,
  ErrorOutline,
  InfoOutlined,
  DeleteOutline,
  AccessTime,
  Done,
  DoneAll,
  Circle
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

// استایل‌های کامپوننت
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
  direction: 'rtl',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '& .MuiTab-root': {
    minWidth: 100,
    fontWeight: 500,
    fontSize: '0.95rem',
  },
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(-4px)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    unread: theme.palette.primary.main,
    read: theme.palette.success.main,
    urgent: theme.palette.error.main,
  };
  return {
    backgroundColor: alpha(colors[status], 0.1),
    color: colors[status],
    fontWeight: 500,
    fontSize: '0.75rem',
  };
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
});

const NotificationsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت اعلان‌ها از API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      toast.error('خطا در دریافت اعلان‌ها');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // حذف اعلان
  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(prev => prev.filter(note => note.id !== notificationId));
      toast.success('اعلان با موفقیت حذف شد');
    } catch (error) {
      toast.error('خطا در حذف اعلان');
      console.error('Error deleting notification:', error);
    }
  };

  // علامت‌گذاری به عنوان خوانده شده
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/mark-as-read/`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(prev => prev.map(note =>
        note.id === notificationId ? { ...note, status: 'read' } : note
      ));
      toast.success('اعلان به عنوان خوانده شده علامت‌گذاری شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی وضعیت اعلان');
      console.error('Error marking notification as read:', error);
    }
  };

  // علامت‌گذاری همه به عنوان خوانده شده
  const handleMarkAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/mark-all-as-read/', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(prev => prev.map(note => ({ ...note, status: 'read' })));
      toast.success('همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی وضعیت اعلان‌ها');
      console.error('Error marking all notifications as read:', error);
    }
  };

  // دریافت آیکون مناسب برای هر نوع اعلان
  const getStatusIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutline sx={{ color: 'success.main' }} />;
      case 'warning':
        return <ErrorOutline sx={{ color: 'warning.main' }} />;
      case 'info':
        return <InfoOutlined sx={{ color: 'info.main' }} />;
      default:
        return <Circle sx={{ color: 'primary.main' }} />;
    }
  };

  // تبدیل وضعیت به متن فارسی
  const getStatusLabel = (status) => {
    switch (status) {
      case 'unread':
        return 'خوانده نشده';
      case 'read':
        return 'خوانده شده';
      case 'urgent':
        return 'فوری';
      default:
        return status;
    }
  };

  // فیلتر کردن اعلان‌ها بر اساس تب انتخاب شده
  const getFilteredNotifications = () => {
    switch (currentTab) {
      case 0:
        return notifications;
      case 1:
        return notifications.filter(note => note.status === 'unread');
      case 2:
        return notifications.filter(note => note.status === 'urgent');
      default:
        return notifications;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <StyledPaper>
        <NotificationHeader>
          <Typography variant="h5" fontWeight={600}>
            اعلان‌ها و پیام‌ها
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DoneAll />}
              size="small"
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(note => note.status === 'unread')}
            >
              علامت‌گذاری همه به‌عنوان خوانده‌شده
            </Button>
          </Box>
        </NotificationHeader>

        <StyledTabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          centered
        >
          <Tab label={`همه (${notifications.length})`} />
          <Tab label={`خوانده نشده (${notifications.filter(n => n.status === 'unread').length})`} />
          <Tab label={`فوری (${notifications.filter(n => n.status === 'urgent').length})`} />
        </StyledTabs>

        <List sx={{ py: 0 }}>
          {getFilteredNotifications().length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                اعلانی برای نمایش وجود ندارد
              </Typography>
            </Box>
          ) : (
            getFilteredNotifications().map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${notification.type}.light` }}>
                      {getStatusIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {notification.title}
                        </Typography>
                        <StatusChip
                          size="small"
                          label={getStatusLabel(notification.status)}
                          status={notification.status}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled">
                            {notification.time}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {notification.status !== 'read' && (
                      <Tooltip title="علامت‌گذاری به‌عنوان خوانده‌شده">
                        <ActionButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Done />
                        </ActionButton>
                      </Tooltip>
                    )}
                    <Tooltip title="حذف">
                      <ActionButton
                        size="small"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <DeleteOutline />
                      </ActionButton>
                    </Tooltip>
                  </Box>
                </NotificationItem>
                {index < getFilteredNotifications().length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          )}
        </List>
      </StyledPaper>
    </PageContainer>
  );
};

export default NotificationsPage;