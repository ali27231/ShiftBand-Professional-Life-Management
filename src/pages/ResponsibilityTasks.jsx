import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Assignment as TaskIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontSize: '1.1rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    color: '#000a42',
    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
    fontSize: '1.102rem',
  }
}));

const TaskItem = styled(ListItem)(({ theme, completed }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  backgroundColor: completed ? 'rgba(76, 175, 80, 0.1)' : theme.palette.background.paper,
  border: `1px solid ${completed ? theme.palette.success.light : theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: completed ? 'rgba(76, 175, 80, 0.2)' : theme.palette.action.hover,
  }
}));

const ResponsibilityTasks = () => {
  const initialTasks = () => {
    const savedTasks = localStorage.getItem('responsibilityTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: 'طراحی لوگو پروژه',
        description: 'طراحی لوگو با رنگ‌های برند',
        priority: 'high',
        deadline: '1402/09/15',
        startDate: '1402/09/01',
        startTime: '09:00',
        endDate: '1402/09/15',
        endTime: '18:00',
        completed: false,
        category: 'design'
      },
      {
        id: 2,
        title: 'طراحی رابط کاربری صفحه اصلی',
        description: 'طراحی UI صفحه اصلی وبسایت',
        priority: 'medium',
        deadline: '1402/09/20',
        startDate: '1402/09/05',
        startTime: '10:00',
        endDate: '1402/09/20',
        endTime: '17:00',
        completed: true,
        category: 'ui'
      }
    ];
  };

  const [tasks, setTasks] = useState(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    category: 'design'
  });

  useEffect(() => {
    localStorage.setItem('responsibilityTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      category: 'design'
    });
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({...task});
    setDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.startDate || !newTask.startTime || !newTask.endDate || !newTask.endTime) {
      setSnackbar({
        open: true,
        message: 'لطفاً تمام فیلدهای ضروری را پر کنید',
        severity: 'error'
      });
      return;
    }

    // اعتبارسنجی تاریخ‌ها
    const startDateTime = new Date(`${newTask.startDate} ${newTask.startTime}`);
    const endDateTime = new Date(`${newTask.endDate} ${newTask.endTime}`);
    
    if (endDateTime < startDateTime) {
      setSnackbar({
        open: true,
        message: 'تاریخ و زمان پایان نمی‌تواند قبل از تاریخ و زمان شروع باشد',
        severity: 'error'
      });
      return;
    }

    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...newTask, id: task.id } : task
      ));
      setSnackbar({
        open: true,
        message: 'وظیفه با موفقیت ویرایش شد',
        severity: 'success'
      });
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
      setSnackbar({
        open: true,
        message: 'وظیفه جدید با موفقیت اضافه شد',
        severity: 'success'
      });
    }
    setDialogOpen(false);
  };

  const handleDeleteTask = (id) => {
    if(window.confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
      setTasks(tasks.filter(task => task.id !== id));
      setSnackbar({
        open: true,
        message: 'وظیفه با موفقیت حذف شد',
        severity: 'info'
      });
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    setSnackbar({
      open: true,
      message: 'وضعیت وظیفه بروزرسانی شد',
      severity: 'success'
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md">
      <Box p={4} dir="rtl">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <TaskIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              مدیریت وظایف مسئولیتی
            </Typography>
            <Typography color="text.secondary" mb={4}>
              مدیریت و پیگیری کارهای گرافیکی و مسئولیت‌های محوله
            </Typography>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h6" fontWeight="bold">
              لیست وظایف
            </Typography>
            <StyledButton
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              افزودن وظیفه جدید
            </StyledButton>
          </Box>

          <List>
            {tasks.map((task) => (
              <TaskItem key={task.id} completed={task.completed}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="h6"
                        style={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={task.category}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<FlagIcon />}
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                      />
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box mt={1} display="flex" gap={2}>
                        <Typography variant="caption" color="text.secondary">
                          شروع: {task.startDate} - {task.startTime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          پایان: {task.endDate} - {task.endTime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          مهلت انجام: {task.deadline}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box>
                  <IconButton 
                    onClick={() => handleToggleComplete(task.id)} 
                    color={task.completed ? "success" : "default"}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditTask(task)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TaskItem>
            ))}
          </List>
        </StyledPaper>

        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingTask ? 'ویرایش وظیفه' : 'افزودن وظیفه جدید'}
          </DialogTitle>
          <DialogContent>
            <StyledTextField
              fullWidth
              label="عنوان"
              margin="normal"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <StyledTextField
              fullWidth
              label="توضیحات"
              margin="normal"
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <StyledFormControl fullWidth margin="normal">
              <InputLabel>اولویت</InputLabel>
              <Select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <MenuItem value="high">بالا</MenuItem>
                <MenuItem value="medium">متوسط</MenuItem>
                <MenuItem value="low">پایین</MenuItem>
              </Select>
            </StyledFormControl>
            <StyledFormControl fullWidth margin="normal">
              <InputLabel>دسته‌بندی</InputLabel>
              <Select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              >
                <MenuItem value="design">طراحی گرافیک</MenuItem>
                <MenuItem value="ui">رابط کاربری</MenuItem>
                <MenuItem value="other">سایر</MenuItem>
              </Select>
            </StyledFormControl>

            <Box display="flex" gap={2} mt={2}>
              <StyledTextField
                fullWidth
                label="تاریخ شروع"
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                placeholder="1402/09/01"
              />
              <StyledTextField
                fullWidth
                label="ساعت شروع"
                type="time"
                value={newTask.startTime}
                onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <StyledTextField
                fullWidth
                label="تاریخ پایان"
                value={newTask.endDate}
                onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                placeholder="1402/09/15"
              />
              <StyledTextField
                fullWidth
                label="ساعت پایان"
                type="time"
                value={newTask.endTime}
                onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Box>

            <StyledTextField
              fullWidth
              label="مهلت انجام"
              margin="normal"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              placeholder="1402/09/30"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSaveTask} variant="contained">
              ذخیره
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: 3 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ResponsibilityTasks;