import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  CircularProgress,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  FitnessCenter as FitnessIcon,
  MenuBook as BookIcon,
  School as SchoolIcon,
  Assignment as TaskIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  HealthAndSafety as HealthIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import moment from 'moment-jalaali';
import { keyframes } from '@emotion/react';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }
}));

const GradientProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
  '& .MuiLinearProgress-bar': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 500,
  '&.completed': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark
  },
  '&.pending': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark
  }
}));

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  height: '100%',
  transition: 'transform 0.2s',
  animation: `${pulseAnimation} 2s infinite`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }
}));

const Dashboard = () => {
  const [exerciseData, setExerciseData] = useState(null);
  const [libraryData, setLibraryData] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setExerciseData(JSON.parse(localStorage.getItem('exerciseSchedule')) || {});
      setLibraryData(JSON.parse(localStorage.getItem('libraryData')) || {});
      setFamilyData(JSON.parse(localStorage.getItem('familyTasks')) || []);
      setStudyData(JSON.parse(localStorage.getItem('studyTrackerData')) || {});
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCompletionRate = (data) => {
    if (!data || !Array.isArray(data)) return 0;
    const completed = data.filter(item => item.completed).length;
    return data.length > 0 ? (completed / data.length) * 100 : 0;
  };

  const getAverageGrade = (subjects) => {
    if (!subjects || !Array.isArray(subjects)) return 0;
    return subjects.reduce((acc, curr) => acc + curr.grade, 0) / subjects.length;
  };

  const getOverviewStats = () => {
    return [
      {
        title: 'تمرینات ورزشی',
        value: exerciseData?.totalExercises || 0,
        icon: <FitnessIcon />,
        color: 'primary'
      },
      {
        title: 'کتاب‌های در حال مطالعه',
        value: libraryData?.books?.reading?.length || 0,
        icon: <BookIcon />,
        color: 'secondary'
      },
      {
        title: 'وظایف خانوادگی',
        value: familyData?.length || 0,
        icon: <TaskIcon />,
        color: 'warning'
      },
      {
        title: 'میانگین نمرات',
        value: getAverageGrade(studyData?.subjects || []).toFixed(2),
        icon: <SchoolIcon />,
        color: 'success'
      }
    ];
  };

  const getWeeklyProgressData = () => {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    return days.map(day => ({
      name: day,
      ورزش: Math.random() * 100,
      مطالعه: Math.random() * 100,
      وظایف: Math.random() * 100
    }));
  };

  const healthData = [
    { name: 'قلب', value: 75, color: '#ff6384' },
    { name: 'تنفس', value: 60, color: '#36a2eb' },
    { name: 'خواب', value: 90, color: '#ffce56' },
    { name: 'فعالیت', value: 50, color: '#4bc0c0' }
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
      <Container maxWidth="xl">
        <Box p={4} dir="rtl">
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight="bold">
              داشبورد مدیریت فعالیت‌ها
            </Typography>
            <Box>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
              >
                <MenuItem disabled>بروزرسانی</MenuItem>
                <MenuItem disabled>تنظیمات</MenuItem>
                <MenuItem disabled>راهنما</MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Overview Cards */}
          <Grid container spacing={3} mb={4}>
            {getOverviewStats().map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StyledCard>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main` }}>
                          {stat.icon}
                        </Avatar>
                        <Typography variant="h6" ml={2}>
                          {stat.title}
                        </Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" mb={1}>
                        {stat.value}
                      </Typography>
                      <GradientProgress variant="determinate" value={75} />
                    </CardContent>
                  </StyledCard>
                </Grid>
            ))}
          </Grid>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              <StyledCard sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    نمودار پیشرفت هفتگی
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getWeeklyProgressData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="ورزش" fill="#2196f3" />
                      <Bar dataKey="مطالعه" fill="#4caf50" />
                      <Bar dataKey="وظایف" fill="#ff9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCard>

              <Grid container spacing={3}>
                {/* Exercise Summary */}
                <Grid item xs={12} sm={6}>
                  <StyledCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          خلاصه تمرینات
                        </Typography>
                        <FitnessIcon color="primary" />
                      </Box>
                      <List>
                        {Object.entries(exerciseData || {}).slice(0, 3).map(([day, exercises]) => (
                            <ListItem key={day}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                  <CalendarIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                  primary={day}
                                  secondary={`${exercises.length} تمرین`}
                              />
                              <StyledChip
                                  label={exercises.length > 0 ? 'فعال' : 'استراحت'}
                                  className={exercises.length > 0 ? 'completed' : 'pending'}
                              />
                            </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </StyledCard>
                </Grid>

                {/* Study Progress */}
                <Grid item xs={12} sm={6}>
                  <StyledCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          پیشرفت تحصیلی
                        </Typography>
                        <SchoolIcon color="secondary" />
                      </Box>
                      <List>
                        {(studyData?.subjects || []).slice(0, 3).map((subject, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                  primary={subject.name}
                                  secondary={
                                    <Box mt={1}>
                                      <LinearProgress
                                          variant="determinate"
                                          value={subject.progress}
                                          sx={{ height: 6, borderRadius: 3 }}
                                      />
                                      <Box display="flex" justifyContent="space-between" mt={0.5}>
                                        <Typography variant="caption">
                                          پیشرفت: {subject.progress}%
                                        </Typography>
                                        <Typography variant="caption">
                                          نمره: {subject.grade}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  }
                              />
                            </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              {/* Health Status */}
              <StyledCard sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      وضعیت سلامتی
                    </Typography>
                    <HealthIcon color="primary" />
                  </Box>
                  <Box display="flex" justifyContent="center" alignItems="center" my={3}>
                    <PieChart width={200} height={200}>
                      <Pie
                          data={healthData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                      >
                        {healthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </Box>
                  <List>
                    {healthData.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: item.color }}>
                              <TrendingUpIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                              primary={item.name}
                              secondary={`${item.value}%`}
                          />
                        </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>

              {/* Family Tasks */}
              <StyledCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      وظایف خانوادگی
                    </Typography>
                    <TaskIcon color="warning" />
                  </Box>
                  <List>
                    {(familyData || []).slice(0, 5).map((task, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: task.completed ? 'success.light' : 'warning.light' }}>
                              {task.completed ? <CheckCircleIcon /> : <TimelineIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                              primary={task.title}
                              secondary={`مسئول: ${task.assignedTo}`}
                          />
                          <StyledChip
                              label={task.completed ? 'انجام شده' : 'در انتظار'}
                              className={task.completed ? 'completed' : 'pending'}
                          />
                        </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>

          {/* Modal for Notifications */}
          <Modal
              open={openModal}
              onClose={handleCloseModal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
          >
            <Fade in={openModal}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
              }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  اطلاعیه‌ها
                </Typography>
                <Typography>
                  هیچ اطلاعیه جدیدی وجود ندارد.
                </Typography>
              </Box>
            </Fade>
          </Modal>
        </Box>
      </Container>
  );
};

export default Dashboard;