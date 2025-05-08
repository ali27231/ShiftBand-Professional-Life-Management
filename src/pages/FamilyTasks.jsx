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
  FamilyRestroom as FamilyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
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

const FamilyTasks = () => {
  const initialTasks = () => {
    const savedTasks = localStorage.getItem('familyTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: 'خرید هفتگی',
        description: 'تهیه مواد غذایی و اقلام ضروری منزل',
        assignedTo: 'پدر',
        startDate: '1402/09/15',
        startTime: '09:00',
        endDate: '1402/09/15',
        endTime: '12:00',
        dueDate: '1402/09/15',
        completed: false,
        category: 'shopping'
      },
      {
        id: 2,
        title: 'نظافت منزل',
        description: 'تمیز کردن اتاق‌ها و گردگیری',
        assignedTo: 'مادر',
        startDate: '1402/09/14',
        startTime: '08:00',
        endDate: '1402/09/14',
        endTime: '14:00',
        dueDate: '1402/09/14',
        completed: true,
        category: 'cleaning'
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
    assignedTo: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    dueDate: '',
    category: 'general'
  });

  useEffect(() => {
    localStorage.setItem('familyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const validateForm = () => {
    if (!newTask.title?.trim()) {
      setSnackbar({
        open: true,
        message: 'لطفاً عنوان کار را وارد کنید',
        severity: 'error'
      });
      return false;
    }
    if (!newTask.assignedTo?.trim()) {
      setSnackbar({
        open: true,
        message: 'لطفاً مسئول انجام کار را مشخص کنید',
        severity: 'error'
      });
      return false;
    }
    if (!newTask.startDate || !newTask.startTime || !newTask.endDate || !newTask.endTime) {
      setSnackbar({
        open: true,
        message: 'لطفاً تاریخ و زمان شروع و پایان را وارد کنید',
        severity: 'error'
      });
      return false;
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
      return false;
    }

    return true;
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      dueDate: '',
      category: 'general'
    });
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!validateForm()) return;

    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...newTask, id: task.id } : task
      ));
      setSnackbar({
        open: true,
        message: 'کار با موفقیت ویرایش شد',
        severity: 'success'
      });
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
      setSnackbar({
        open: true,
        message: 'کار جدید با موفقیت اضافه شد',
        severity: 'success'
      });
    }
    setDialogOpen(false);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('آیا از حذف این کار اطمینان دارید؟')) {
      setTasks(tasks.filter(task => task.id !== id));
      setSnackbar({
        open: true,
        message: 'کار با موفقیت حذف شد',
        severity: 'info'
      });
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === id);
    setSnackbar({
      open: true,
      message: task.completed ? 'کار به حالت ناتمام تغییر کرد' : 'کار با موفقیت تکمیل شد',
      severity: 'success'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      shopping: 'primary',
      cleaning: 'secondary',
      education: 'warning',
      general: 'default'
    };
    return colors[category] || 'default';
  };

  return (
    <Container maxWidth="md">
      <Box p={4} dir="rtl">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <FamilyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              کارهای خانوادگی
            </Typography>
            <Typography color="text.secondary" mb={4}>
              مدیریت و پیگیری کارهای روزمره خانواده
            </Typography>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h6" fontWeight="bold">
              لیست کارها
            </Typography>
            <StyledButton
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              افزودن کار جدید
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
                        color={getCategoryColor(task.category)}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mt={1}>
                        <Chip
                          icon={<PersonIcon />}
                          label={`مسئول: ${task.assignedTo}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<TimeIcon />}
                          label={`شروع: ${task.startDate} - ${task.startTime}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<TimeIcon />}
                          label={`پایان: ${task.endDate} - ${task.endTime}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<CalendarIcon />}
                          label={`مهلت: ${task.dueDate}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  }
                />
                <Box>
                  <IconButton onClick={() => handleToggleComplete(task.id)} color={task.completed ? "success" : "default"}>
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
            {editingTask ? 'ویرایش کار' : 'افزودن کار جدید'}
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
            <StyledTextField
              fullWidth
              label="مسئول انجام"
              margin="normal"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            />
            
            <Box display="flex" gap={2} mt={2}>
              <StyledTextField
                fullWidth
                label="تاریخ شروع"
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                placeholder="1402/09/15"
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

            <StyledFormControl fullWidth margin="normal">
              <InputLabel>دسته‌بندی</InputLabel>
              <Select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              >
                <MenuItem value="shopping">خرید</MenuItem>
                <MenuItem value="cleaning">نظافت</MenuItem>
                <MenuItem value="education">آموزشی</MenuItem>
                <MenuItem value="general">عمومی</MenuItem>
              </Select>
            </StyledFormControl>
            
            <StyledTextField
              fullWidth
              label="مهلت انجام"
              margin="normal"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              placeholder="1402/09/15"
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

export default FamilyTasks;