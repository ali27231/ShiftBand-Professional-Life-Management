import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Fade,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Code as CodeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1000,
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  height: '100%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontSize: '1.1rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const ProgressChip = styled(Chip)(({ progress }) => ({
  backgroundColor: progress === 100 ? '#4caf50' : '#2196f3',
  color: 'white',
}));

const ProgrammingPortfolio = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'React.js پیشرفته',
      platform: 'Udemy',
      progress: 100,
      completionDate: '1402/08/15',
      certificate: true
    },
    {
      id: 2,
      name: 'Node.js و Express',
      platform: 'Pluralsight',
      progress: 75,
      completionDate: 'در حال انجام',
      certificate: false
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'سیستم مدیریت آموزش',
      status: 'completed',
      technologies: ['React', 'Node.js', 'MongoDB'],
      description: 'یک پلتفرم آموزش آنلاین با قابلیت مدیریت دوره‌ها و دانشجویان',
      github: 'github.com/example/lms'
    },
    {
      id: 2,
      name: 'اپلیکیشن موبایل فروشگاهی',
      status: 'in-progress',
      technologies: ['React Native', 'Firebase'],
      description: 'اپلیکیشن فروشگاه آنلاین با امکان پرداخت و پیگیری سفارشات',
      github: 'github.com/example/shop-app'
    }
  ]);

  const [futureProjects, setFutureProjects] = useState([
    {
      id: 1,
      name: 'پلتفرم همکاری تیمی',
      description: 'سیستم مدیریت پروژه و همکاری تیمی با قابلیت چت و تقویم',
      technologies: ['Vue.js', 'GraphQL', 'PostgreSQL'],
      priority: 'بالا'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [newItem, setNewItem] = useState({});

  const handleAddItem = (type) => {
    setDialogType(type);
    setDialogOpen(true);
    setNewItem({});
  };

  const handleSave = () => {
    switch(dialogType) {
      case 'course':
        setCourses([...courses, { ...newItem, id: Date.now() }]);
        break;
      case 'project':
        setProjects([...projects, { ...newItem, id: Date.now() }]);
        break;
      case 'future':
        setFutureProjects([...futureProjects, { ...newItem, id: Date.now() }]);
        break;
    }
    setDialogOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box p={4} dir="rtl">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <CodeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              پورتفولیو برنامه‌نویسی
            </Typography>
            <Typography color="text.secondary" mb={4}>
              مدیریت دوره‌ها، پروژه‌ها و ایده‌های برنامه‌نویسی
            </Typography>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          <Box mb={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                دوره‌های آموزشی
              </Typography>
              <StyledButton
                startIcon={<AddIcon />}
                onClick={() => handleAddItem('course')}
              >
                افزودن دوره
              </StyledButton>
            </Box>
            
            <Grid container spacing={3}>
              {courses.map(course => (
                <Grid item xs={12} md={4} key={course.id}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {course.name}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {course.platform}
                      </Typography>
                      <Box mt={2}>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Box display="flex" justifyContent="space-between">
                          <ProgressChip
                            label={`${course.progress}% تکمیل شده`}
                            size="small"
                            progress={course.progress}
                          />
                          {course.certificate && (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="دارای گواهی"
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                پروژه‌های انجام شده و در حال انجام
              </Typography>
              <StyledButton
                startIcon={<AddIcon />}
                onClick={() => handleAddItem('project')}
              >
                افزودن پروژه
              </StyledButton>
            </Box>

            <Grid container spacing={3}>
              {projects.map(project => (
                <Grid item xs={12} md={6} key={project.id}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {project.name}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {project.description}
                      </Typography>
                      <Box mb={2}>
                        {project.technologies.map((tech, index) => (
                          <Chip
                            key={index}
                            label={tech}
                            sx={{ mr: 1, mb: 1 }}
                            size="small"
                          />
                        ))}
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Chip
                          label={project.status === 'completed' ? 'تکمیل شده' : 'در حال انجام'}
                          color={project.status === 'completed' ? 'success' : 'warning'}
                        />
                        <Typography variant="body2" color="primary">
                          {project.github}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                ایده‌ها و پروژه‌های آینده
              </Typography>
              <StyledButton
                startIcon={<AddIcon />}
                onClick={() => handleAddItem('future')}
              >
                افزودن ایده
              </StyledButton>
            </Box>

            <Grid container spacing={3}>
              {futureProjects.map(project => (
                <Grid item xs={12} md={4} key={project.id}>
                  <StyledCard>
                    <CardContent>
                      <LightbulbIcon sx={{ color: 'warning.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        {project.name}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {project.description}
                      </Typography>
                      <Box mb={2}>
                        {project.technologies.map((tech, index) => (
                          <Chip
                            key={index}
                            label={tech}
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                            size="small"
                          />
                        ))}
                      </Box>
                      <Chip
                        label={`اولویت: ${project.priority}`}
                        color="primary"
                        variant="outlined"
                      />
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </StyledPaper>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            {dialogType === 'course' ? 'افزودن دوره جدید' :
             dialogType === 'project' ? 'افزودن پروژه جدید' :
             'افزودن ایده جدید'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="نام"
              margin="normal"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="توضیحات"
              margin="normal"
              multiline
              rows={3}
              value={newItem.description || ''}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSave} variant="contained">
              ذخیره
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProgrammingPortfolio;