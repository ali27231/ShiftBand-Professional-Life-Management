import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Fade,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Fab,
  Snackbar,
  Alert,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  NavigateBefore,
  NavigateNext,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import moment from 'moment-jalaali';

// تنظیمات moment-jalaali
moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

// استایل‌های سفارشی
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const Exercise = () => {
  // State های اصلی
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem('exerciseSchedule');
    return savedSchedule ? JSON.parse(savedSchedule) : {
      شنبه: ['شنا - 3×12', 'شکم - 3×12'],
      یکشنبه: ['شنا - 3×12', 'شکم - 3×12'],
      دوشنبه: ['شنا - 3×12', 'شکم - 3×12'],
      سه‌شنبه: ['شنا - 3×12', 'شکم - 3×12'],
      چهارشنبه: ['شنا - 3×12', 'شکم - 3×12'],
      پنج‌شنبه: ['شنا - 3×12', 'شکم - 3×12'],
      جمعه: ['استراحت']
    };
  });

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('exerciseTodos');
    return savedTodos ? JSON.parse(savedTodos) : [
      { id: 1, text: 'شکم', completed: false, sets: 3, reps: 12 },
      { id: 2, text: 'شنا', completed: true, sets: 3, reps: 12 }
    ];
  });

  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('exerciseStats');
    return savedStats ? JSON.parse(savedStats) : {
      weeklyMinutes: 280,
      totalExercises: 360,
      streak: 5,
      progress: 75
    };
  });

  // State های مربوط به دیالوگ‌ها
  const [dialogs, setDialogs] = useState({
    edit: { open: false, day: '', exercises: [] },
    add: { open: false, day: '' },
    delete: { open: false, day: '', index: null },
    addTodo: { open: false },
    editTodo: { open: false, todo: null }
  });

  // State مربوط به Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ذخیره در localStorage
  useEffect(() => {
    localStorage.setItem('exerciseSchedule', JSON.stringify(schedule));
    localStorage.setItem('exerciseTodos', JSON.stringify(todos));
    localStorage.setItem('exerciseStats', JSON.stringify(stats));
  }, [schedule, todos, stats]);

  // محاسبه پیشرفت بر اساس تمرینات انجام شده
  useEffect(() => {
    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;
    const newProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    setStats(prev => ({ ...prev, progress: newProgress }));
  }, [todos]);

  // توابع مدیریت هفته
  const changeWeek = (amount) => {
    setCurrentWeek(moment(currentWeek).add(amount, 'week'));
  };

  // توابع مدیریت تمرینات
  const handleEditDay = (day, exercises) => {
    setDialogs({
      ...dialogs,
      edit: { open: true, day, exercises: [...exercises] }
    });
  };

  const handleSaveExercises = () => {
    setSchedule({
      ...schedule,
      [dialogs.edit.day]: dialogs.edit.exercises
    });
    setDialogs({ ...dialogs, edit: { ...dialogs.edit, open: false } });
    showSnackbar('تمرینات با موفقیت ذخیره شد', 'success');
  };

  const handleAddExercise = (day) => {
    setDialogs({
      ...dialogs,
      add: { open: true, day }
    });
  };

  const handleDeleteExercise = (day, index) => {
    setDialogs({
      ...dialogs,
      delete: { open: true, day, index }
    });
  };

  const confirmDelete = () => {
    const { day, index } = dialogs.delete;
    const newExercises = [...schedule[day]];
    newExercises.splice(index, 1);
    setSchedule({
      ...schedule,
      [day]: newExercises
    });
    setDialogs({ ...dialogs, delete: { open: false, day: '', index: null } });
    showSnackbar('تمرین با موفقیت حذف شد', 'success');
  };

  // توابع مدیریت todos
  const handleAddTodo = (text, sets = 3, reps = 12) => {
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      sets,
      reps
    };
    setTodos([...todos, newTodo]);
    setDialogs({ ...dialogs, addTodo: { open: false } });
    showSnackbar('تمرین جدید به لیست امروز اضافه شد', 'success');
  };

  const handleEditTodo = (todo) => {
    setDialogs({
      ...dialogs,
      editTodo: { open: true, todo }
    });
  };

  const handleSaveTodo = (editedTodo) => {
    setTodos(todos.map(t => t.id === editedTodo.id ? editedTodo : t));
    setDialogs({ ...dialogs, editTodo: { open: false, todo: null } });
    showSnackbar('تمرین با موفقیت ویرایش شد', 'success');
  };

  const handleToggleTodo = (todoId) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
    updateStats();
  };

  // توابع کمکی
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const updateStats = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    setStats(prev => ({
      ...prev,
      totalExercises: prev.totalExercises + 1,
      weeklyMinutes: prev.weeklyMinutes + 30,
      streak: completedCount > 0 ? prev.streak + 1 : 0
    }));
  };

  return (
    <Container maxWidth="md">
      <Box p={4} dir="rtl">
        {/* هدر */}
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <FitnessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              برنامه تمرینی من
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {currentWeek.format('jDD jMMMM jYYYY')}
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                startIcon={<NavigateBefore />}
                onClick={() => changeWeek(-1)}
                variant="outlined"
              >
                هفته قبل
              </Button>
              <Button
                endIcon={<NavigateNext />}
                onClick={() => changeWeek(1)}
                variant="outlined"
              >
                هفته بعد
              </Button>
            </Box>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          {/* برنامه هفتگی */}
          <Grid container spacing={3}>
            {Object.entries(schedule).map(([day, exercises]) => (
              <Grid item xs={12} sm={6} md={4} key={day}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {day}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => handleEditDay(day, exercises)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAddExercise(day)}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <List dense>
                      {exercises.map((exercise, index) => (
                        <StyledListItem
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteExercise(day, index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={exercise}
                            primaryTypographyProps={{
                              style: { fontWeight: 500 }
                            }}
                          />
                        </StyledListItem>
                      ))}
                    </List>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* تمرینات امروز */}
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                تمرینات امروز
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setDialogs({ ...dialogs, addTodo: { open: true } })}
                variant="contained"
              >
                افزودن تمرین
              </Button>
            </Box>
            <List>
              {todos.map((todo) => (
                <StyledListItem key={todo.id}>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <ListItemText
                    primary={todo.text}
                    secondary={`${todo.sets} ست × ${todo.reps} تکرار`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleEditTodo(todo)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setTodos(todos.filter(t => t.id !== todo.id));
                        showSnackbar('تمرین با موفقیت حذف شد', 'success');
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </StyledListItem>
              ))}
            </List>
          </Box>

          {/* آمار */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              آمار عملکرد
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <TimelineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {stats.weeklyMinutes}
                  </Typography>
                  <Typography color="text.secondary">
                    دقیقه تمرین در هفته
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <FitnessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalExercises}
                  </Typography>
                  <Typography color="text.secondary">
                    تعداد حرکات انجام شده
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <TimelineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {stats.streak}
                  </Typography>
                  <Typography color="text.secondary">
                    روز متوالی تمرین
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Typography variant="subtitle2" mb={1}>
                پیشرفت هفتگی
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </StyledPaper>

        {/* دیالوگ‌ها */}
        {/* دیالوگ ویرایش روز */}
        <Dialog
          open={dialogs.edit.open}
          onClose={() => setDialogs({ ...dialogs, edit: { ...dialogs.edit, open: false } })}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>ویرایش تمرینات {dialogs.edit.day}</DialogTitle>
          <DialogContent>
            {dialogs.edit.exercises.map((exercise, index) => (
              <TextField
                key={index}
                fullWidth
                margin="normal"
                value={exercise}
                onChange={(e) => {
                  const newExercises = [...dialogs.edit.exercises];
                  newExercises[index] = e.target.value;
                  setDialogs({
                    ...dialogs,
                    edit: { ...dialogs.edit, exercises: newExercises }
                  });
                }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<CancelIcon />}
              onClick={() => setDialogs({ ...dialogs, edit: { ...dialogs.edit, open: false } })}
            >
              انصراف
            </Button>
            <Button
              startIcon={<SaveIcon />}
              onClick={handleSaveExercises}
              variant="contained"
            >
              ذخیره
            </Button>
          </DialogActions>
        </Dialog>

        {/* دیالوگ افزودن تمرین جدید */}
        <Dialog
          open={dialogs.add.open}
          onClose={() => setDialogs({ ...dialogs, add: { ...dialogs.add, open: false } })}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>افزودن تمرین جدید برای {dialogs.add.day}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              label="تمرین جدید"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const newExercise = e.target.value;
                  if (newExercise.trim()) {
                    setSchedule({
                      ...schedule,
                      [dialogs.add.day]: [...schedule[dialogs.add.day], newExercise]
                    });
                    setDialogs({ ...dialogs, add: { open: false, day: '' } });
                    showSnackbar('تمرین جدید اضافه شد');
                  }
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogs({ ...dialogs, add: { ...dialogs.add, open: false } })}
            >
              انصراف
            </Button>
            <Button
              onClick={(e) => {
                const input = e.target.closest('div').querySelector('input');
                const newExercise = input.value;
                if (newExercise.trim()) {
                  setSchedule({
                    ...schedule,
                    [dialogs.add.day]: [...schedule[dialogs.add.day], newExercise]
                  });
                  setDialogs({ ...dialogs, add: { open: false, day: '' } });
                  showSnackbar('تمرین جدید اضافه شد');
                }
              }}
              variant="contained"
            >
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        {/* دیالوگ حذف تمرین */}
        <Dialog
          open={dialogs.delete.open}
          onClose={() => setDialogs({ ...dialogs, delete: { ...dialogs.delete, open: false } })}
        >
          <DialogTitle>حذف تمرین</DialogTitle>
          <DialogContent>
            <Typography>
              آیا از حذف این تمرین اطمینان دارید؟
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogs({ ...dialogs, delete: { ...dialogs.delete, open: false } })}
            >
              انصراف
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>

        {/* دیالوگ افزودن تمرین روزانه */}
        <Dialog
          open={dialogs.addTodo.open}
          onClose={() => setDialogs({ ...dialogs, addTodo: { open: false } })}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>افزودن تمرین به لیست امروز</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              label="نام تمرین"
              id="exercise-name"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="تعداد ست"
                  type="number"
                  defaultValue={3}
                  id="exercise-sets"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="تعداد تکرار"
                  type="number"
                  defaultValue={12}
                  id="exercise-reps"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogs({ ...dialogs, addTodo: { open: false } })}
            >
              انصراف
            </Button>
            <Button
              onClick={() => {
                const name = document.getElementById('exercise-name').value;
                const sets = document.getElementById('exercise-sets').value;
                const reps = document.getElementById('exercise-reps').value;
                if (name.trim()) {
                  handleAddTodo(name, parseInt(sets), parseInt(reps));
                }
              }}
              variant="contained"
            >
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        {/* دیالوگ ویرایش تمرین روزانه */}
        <Dialog
          open={dialogs.editTodo.open}
          onClose={() => setDialogs({ ...dialogs, editTodo: { open: false, todo: null } })}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>ویرایش تمرین</DialogTitle>
          <DialogContent>
            {dialogs.editTodo.todo && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="نام تمرین"
                  value={dialogs.editTodo.todo.text}
                  onChange={(e) => {
                    setDialogs({
                      ...dialogs,
                      editTodo: {
                        ...dialogs.editTodo,
                        todo: { ...dialogs.editTodo.todo, text: e.target.value }
                      }
                    });
                  }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="تعداد ست"
                      type="number"
                      value={dialogs.editTodo.todo.sets}
                      onChange={(e) => {
                        setDialogs({
                          ...dialogs,
                          editTodo: {
                            ...dialogs.editTodo,
                            todo: { ...dialogs.editTodo.todo, sets: parseInt(e.target.value) }
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="تعداد تکرار"
                      type="number"
                      value={dialogs.editTodo.todo.reps}
                      onChange={(e) => {
                        setDialogs({
                          ...dialogs,
                          editTodo: {
                            ...dialogs.editTodo,
                            todo: { ...dialogs.editTodo.todo, reps: parseInt(e.target.value) }
                          }
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogs({ ...dialogs, editTodo: { open: false, todo: null } })}
            >
              انصراف
            </Button>
            <Button
              onClick={() => handleSaveTodo(dialogs.editTodo.todo)}
              variant="contained"
            >
              ذخیره
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default Exercise;