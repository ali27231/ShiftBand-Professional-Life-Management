import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  FitnessCenter as FitnessIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';


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

const Exercise = () => {
  const [schedule, setSchedule] = useState({
    شنبه: ['پرس سینه - 3×12', 'جلو بازو - 4×10', 'زیر بغل - 3×12'],
    یکشنبه: ['اسکوات - 4×10', 'جلو پا - 3×12', 'ساق پا - 4×15'],
    دوشنبه: ['شنا - 3×15', 'پشت بازو - 4×12', 'سرشانه - 3×12'],
    سه‌شنبه: ['ددلیفت - 3×10', 'پشت پا - 4×12', 'ساق پا - 3×15'],
    چهارشنبه: ['پرس سینه - 4×10', 'سرشانه - 3×12', 'جلو بازو - 3×12'],
    پنج‌شنبه: ['اسکوات - 3×12', 'پشت پا - 4×10', 'ساق پا - 4×15'],
    جمعه: ['استراحت']
  });

  const [todos, setTodos] = useState([
    { text: 'تمرین سینه و جلو بازو', completed: false },
    { text: 'تمرین پا', completed: true },
    { text: '45 دقیقه کاردیو', completed: false }
  ]);

  const [stats, setStats] = useState({
    weeklyMinutes: 280,
    totalExercises: 145,
    streak: 12
  });

  const [editDialog, setEditDialog] = useState({
    open: false,
    day: '',
    exercises: []
  });

  const handleEditDay = (day, exercises) => {
    setEditDialog({
      open: true,
      day,
      exercises: [...exercises]
    });
  };

  const handleSaveExercises = () => {
    setSchedule({
      ...schedule,
      [editDialog.day]: editDialog.exercises
    });
    setEditDialog({ ...editDialog, open: false });
  };

  return (
    <Container maxWidth="md">
      <Box p={4} dir="rtl">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <FitnessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              برنامه تمرینی من
            </Typography>
            <Typography color="text.secondary" mb={4}>
              برنامه‌ریزی و پیگیری تمرینات ورزشی
            </Typography>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          <Grid container spacing={3}>
            {Object.entries(schedule).map(([day, exercises]) => (
              <Grid item xs={12} sm={6} md={4} key={day}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {day}
                      </Typography>
                      <IconButton onClick={() => handleEditDay(day, exercises)}>
                        <EditIcon />
                      </IconButton>
                    </Box>
                    <List dense>
                      {exercises.map((exercise, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={exercise} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              تمرینات امروز
            </Typography>
            <List>
              {todos.map((todo, index) => (
                <ListItem key={index}>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => {
                      const newTodos = [...todos];
                      newTodos[index].completed = !newTodos[index].completed;
                      setTodos(newTodos);
                    }}
                  />
                  <ListItemText primary={todo.text} />
                </ListItem>
              ))}
            </List>
          </Box>

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
                value={70}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </StyledPaper>

        <Dialog open={editDialog.open} onClose={() => setEditDialog({ ...editDialog, open: false })}>
          <DialogTitle>ویرایش تمرینات {editDialog.day}</DialogTitle>
          <DialogContent>
            {editDialog.exercises.map((exercise, index) => (
              <TextField
                key={index}
                fullWidth
                margin="normal"
                value={exercise}
                onChange={(e) => {
                  const newExercises = [...editDialog.exercises];
                  newExercises[index] = e.target.value;
                  setEditDialog({ ...editDialog, exercises: newExercises });
                }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ ...editDialog, open: false })}>انصراف</Button>
            <Button onClick={handleSaveExercises} variant="contained">
              ذخیره
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Exercise;