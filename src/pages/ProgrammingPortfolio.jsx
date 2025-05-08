import React, { useState, useEffect } from 'react';
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
  Divider,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Code as CodeIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon
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
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontSize: '1.1rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.2s',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
  }
}));

const ProgressChip = styled(Chip)(({ progress }) => ({
  backgroundColor: progress === 100 ? '#4caf50' : '#2196f3',
  color: 'white',
  '& .MuiChip-label': {
    fontWeight: 500,
  }
}));

const ProgrammingPortfolio = () => {
  const initialCourses = () => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'React.js پیشرفته',
        platform: 'Udemy',
        progress: 100,
        completionDate: '1402/08/15',
        certificate: true,
        description: 'دوره جامع ری‌اکت با تمرکز بر هوک‌ها و پرفورمنس',
        instructor: 'علی محمدی'
      },
      {
        id: 2,
        name: 'Node.js و Express',
        platform: 'Pluralsight',
        progress: 75,
        completionDate: 'در حال انجام',
        certificate: false,
        description: 'آموزش کامل بک‌اند با Node.js',
        instructor: 'رضا احمدی'
      }
    ];
  };

  const initialProjects = () => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'سیستم مدیریت آموزش',
        status: 'completed',
        technologies: ['React', 'Node.js', 'MongoDB'],
        description: 'یک پلتفرم آموزش آنلاین با قابلیت مدیریت دوره‌ها و دانشجویان',
        github: 'github.com/example/lms',
        demoLink: 'https://demo-lms.com',
        completionDate: '1402/06/15'
      },
      {
        id: 2,
        name: 'اپلیکیشن موبایل فروشگاهی',
        status: 'in-progress',
        technologies: ['React Native', 'Firebase'],
        description: 'اپلیکیشن فروشگاه آنلاین با امکان پرداخت و پیگیری سفارشات',
        github: 'github.com/example/shop-app',
        demoLink: '',
        completionDate: 'در حال انجام'
      }
    ];
  };

  const initialFutureProjects = () => {
    const saved = localStorage.getItem('futureProjects');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'پلتفرم همکاری تیمی',
        description: 'سیستم مدیریت پروژه و همکاری تیمی با قابلیت چت و تقویم',
        technologies: ['Vue.js', 'GraphQL', 'PostgreSQL'],
        priority: 'بالا',
        estimatedTime: '6 ماه',
        requiredSkills: ['Vue.js', 'Backend Development', 'Database Design']
      }
    ];
  };

  const [courses, setCourses] = useState(initialCourses);
  const [projects, setProjects] = useState(initialProjects);
  const [futureProjects, setFutureProjects] = useState(initialFutureProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [newItem, setNewItem] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('futureProjects', JSON.stringify(futureProjects));
  }, [futureProjects]);

  const handleAddItem = (type) => {
    setDialogType(type);
    setEditingItem(null);
    setNewItem({
      technologies: [],
      progress: 0,
      status: 'in-progress',
      priority: 'متوسط',
      certificate: false
    });
    setDialogOpen(true);
  };

  const handleEditItem = (type, item) => {
    setDialogType(type);
    setEditingItem(item);
    setNewItem({...item});
    setDialogOpen(true);
  };

  const handleDeleteItem = (type, id) => {
    if(window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
      switch(type) {
        case 'course':
          setCourses(courses.filter(item => item.id !== id));
          break;
        case 'project':
          setProjects(projects.filter(item => item.id !== id));
          break;
        case 'future':
          setFutureProjects(futureProjects.filter(item => item.id !== id));
          break;
      }
      setSnackbar({
        open: true,
        message: 'مورد با موفقیت حذف شد',
        severity: 'success'
      });
    }
  };

  const validateItem = (item, type) => {
    if (!item.name?.trim()) {
      setSnackbar({
        open: true,
        message: 'لطفاً نام را وارد کنید',
        severity: 'error'
      });
      return false;
    }

    if (type === 'course' && (item.progress < 0 || item.progress > 100)) {
      setSnackbar({
        open: true,
        message: 'درصد پیشرفت باید بین 0 تا 100 باشد',
        severity: 'error'
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateItem(newItem, dialogType)) return;

    const itemWithId = {
      ...newItem,
      id: editingItem ? editingItem.id : Date.now()
    };

    switch(dialogType) {
      case 'course':
        if (editingItem) {
          setCourses(courses.map(item => 
            item.id === editingItem.id ? itemWithId : item
          ));
        } else {
          setCourses([...courses, itemWithId]);
        }
        break;
      case 'project':
        if (editingItem) {
          setProjects(projects.map(item =>
            item.id === editingItem.id ? itemWithId : item
          ));
        } else {
          setProjects([...projects, itemWithId]);
        }
        break;
      case 'future':
        if (editingItem) {
          setFutureProjects(futureProjects.map(item =>
            item.id === editingItem.id ? itemWithId : item
          ));
        } else {
          setFutureProjects([...futureProjects, itemWithId]);
        }
        break;
    }

    setSnackbar({
      open: true,
      message: editingItem ? 'تغییرات با موفقیت ذخیره شد' : 'مورد جدید با موفقیت اضافه شد',
      severity: 'success'
    });
    setDialogOpen(false);
  };

  const renderDialogContent = () => {
    switch(dialogType) {
      case 'course':
        return (
          <>
            <TextField
              fullWidth
              label="نام دوره"
              margin="normal"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <TextField
              fullWidth
              label="پلتفرم"
              margin="normal"
              value={newItem.platform || ''}
              onChange={(e) => setNewItem({...newItem, platform: e.target.value})}
            />
            <TextField
              fullWidth
              label="مدرس"
              margin="normal"
              value={newItem.instructor || ''}
              onChange={(e) => setNewItem({...newItem, instructor: e.target.value})}
            />
            <TextField
              fullWidth
              label="توضیحات"
              multiline
              rows={3}
              margin="normal"
              value={newItem.description || ''}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
            <TextField
              fullWidth
              label="درصد پیشرفت"
              type="number"
              margin="normal"
              value={newItem.progress || 0}
              onChange={(e) => setNewItem({...newItem, progress: parseInt(e.target.value)})}
            />
            <TextField
              fullWidth
              label="تاریخ تکمیل"
              margin="normal"
              value={newItem.completionDate || ''}
              onChange={(e) => setNewItem({...newItem, completionDate: e.target.value})}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newItem.certificate || false}
                  onChange={(e) => setNewItem({...newItem, certificate: e.target.checked})}
                />
              }
              label="دارای گواهینامه"
            />
          </>
        );
      
      case 'project':
        return (
          <>
            <TextField
              fullWidth
              label="نام پروژه"
              margin="normal"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <TextField
              fullWidth
              label="توضیحات"
              multiline
              rows={3}
              margin="normal"
              value={newItem.description || ''}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
            <TextField
              fullWidth
              label="تکنولوژی‌ها (با کاما جدا کنید)"
              margin="normal"
              value={newItem.technologies ? newItem.technologies.join(',') : ''}
              onChange={(e) => setNewItem({...newItem, technologies: e.target.value.split(',')})}
            />
            <TextField
              fullWidth
              label="لینک گیت‌هاب"
              margin="normal"
              value={newItem.github || ''}
              onChange={(e) => setNewItem({...newItem, github: e.target.value})}
            />
            <TextField
              fullWidth
              label="لینک دمو"
              margin="normal"
              value={newItem.demoLink || ''}
              onChange={(e) => setNewItem({...newItem, demoLink: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>وضعیت</InputLabel>
              <Select
                value={newItem.status || 'in-progress'}
                onChange={(e) => setNewItem({...newItem, status: e.target.value})}
              >
                <MenuItem value="completed">تکمیل شده</MenuItem>
                <MenuItem value="in-progress">در حال انجام</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="تاریخ تکمیل"
              margin="normal"
              value={newItem.completionDate || ''}
              onChange={(e) => setNewItem({...newItem, completionDate: e.target.value})}
            />
          </>
        );

      case 'future':
        return (
          <>
            <TextField
              fullWidth
              label="نام ایده"
              margin="normal"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <TextField
              fullWidth
              label="توضیحات"
              multiline
              rows={3}
              margin="normal"
              value={newItem.description || ''}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
            <TextField
              fullWidth
              label="تکنولوژی‌ها (با کاما جدا کنید)"
              margin="normal"
              value={newItem.technologies ? newItem.technologies.join(',') : ''}
              onChange={(e) => setNewItem({...newItem, technologies: e.target.value.split(',')})}
            />
            <TextField
              fullWidth
              label="مهارت‌های مورد نیاز (با کاما جدا کنید)"
              margin="normal"
              value={newItem.requiredSkills ? newItem.requiredSkills.join(',') : ''}
              onChange={(e) => setNewItem({...newItem, requiredSkills: e.target.value.split(',')})}
            />
            <TextField
              fullWidth
              label="زمان تخمینی"
              margin="normal"
              value={newItem.estimatedTime || ''}
              onChange={(e) => setNewItem({...newItem, estimatedTime: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>اولویت</InputLabel>
              <Select
                value={newItem.priority || 'متوسط'}
                onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
              >
                <MenuItem value="بالا">بالا</MenuItem>
                <MenuItem value="متوسط">متوسط</MenuItem>
                <MenuItem value="پایین">پایین</MenuItem>
              </Select>
            </FormControl>
          </>
        );
    }
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
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Typography variant="h6" gutterBottom>
                          {course.name}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleEditItem('course', course)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('course', course.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography color="text.secondary" gutterBottom>
                        {course.platform} • {course.instructor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {course.description}
                      </Typography>
                      <Box mt={2}>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
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
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Typography variant="h6" gutterBottom>
                          {project.name}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleEditItem('project', project)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('project', project.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
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
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={project.status === 'completed' ? 'تکمیل شده' : 'در حال انجام'}
                          color={project.status === 'completed' ? 'success' : 'warning'}
                        />
                        <Box>
                          {project.github && (
                            <IconButton
                              size="small"
                              href={project.github}
                              target="_blank"
                              sx={{ mr: 1 }}
                            >
                              <GitHubIcon />
                            </IconButton>
                          )}
                          {project.demoLink && (
                            <Button
                              variant="outlined"
                              size="small"
                              href={project.demoLink}
                              target="_blank"
                            >
                              مشاهده دمو
                            </Button>
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
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Box display="flex" alignItems="center">
                          <LightbulbIcon sx={{ color: 'warning.main', mr: 1 }} />
                          <Typography variant="h6">
                            {project.name}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => handleEditItem('future', project)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('future', project.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography color="text.secondary" paragraph sx={{ mt: 2 }}>
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
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={`اولویت: ${project.priority}`}
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {project.estimatedTime}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </StyledPaper>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingItem ? 'ویرایش' : 'افزودن'} 
            {dialogType === 'course' ? ' دوره' : 
             dialogType === 'project' ? ' پروژه' : ' ایده'}
          </DialogTitle>
          <DialogContent>
            {renderDialogContent()}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSave} variant="contained">
              ذخیره
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({...snackbar, open: false})}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setSnackbar({...snackbar, open: false})}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ProgrammingPortfolio;