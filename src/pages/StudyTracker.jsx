import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import moment from 'moment-jalaali';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1000,
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  height: '100%',
}));

const StudyTracker = () => {
  const getCurrentWeekDates = () => {
    const today = moment();
    const weekStart = today.clone().startOf('week');
    
    return Array(7).fill().map((_, i) => {
      return weekStart.clone().add(i, 'days').format('jYYYY/jMM/jDD');
    });
  };

  const getWeekNumber = () => {
    return moment().format('W');
  };

  const checkAndResetWeeklyData = (savedData) => {
    const currentWeek = getWeekNumber();
    const savedWeek = localStorage.getItem('currentWeek');

    if (savedWeek !== currentWeek) {
      const resetData = {
        ...savedData,
        subjects: savedData.subjects.map(subject => ({
          ...subject,
          weeklyHours: Array(7).fill(0)
        })),
        weekDates: getCurrentWeekDates(),
        currentWeek
      };
      localStorage.setItem('studyTrackerData', JSON.stringify(resetData));
      localStorage.setItem('currentWeek', currentWeek);
      return resetData;
    }
    return savedData;
  };

  const initialData = () => {
    const savedData = localStorage.getItem('studyTrackerData');
    const defaultData = {
      subjects: [
        {
          id: 1,
          name: 'حسابان 1',
          weeklyHours: [2, 1.5, 2, 1, 2, 0, 1.5],
          grade: 20,
          progress: 90
        },
        {
          id: 2,
          name: 'فیزیک 2',
          weeklyHours: [1, 2, 1, 1.5, 1, 2, 0],
          grade: 20,
          progress: 100
        },
        {
          id: 3,
          name: 'شیمی 2',
          weeklyHours: [1.5, 1, 2, 1, 1.5, 1, 0],
          grade: 20,
          progress: 85
        }
      ],
      weekDays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
      weekDates: getCurrentWeekDates(),
      currentWeek: getWeekNumber()
    };

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return checkAndResetWeeklyData(parsedData);
    }
    return defaultData;
  };

  const [studyData, setStudyData] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    grade: '',
    weeklyHours: Array(7).fill(0),
    progress: 0
  });

  useEffect(() => {
    const updatedData = checkAndResetWeeklyData(studyData);
    setStudyData(updatedData);
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTrackerData', JSON.stringify(studyData));
  }, [studyData]);

  const getTotalHours = (hours) => {
    return hours.reduce((a, b) => a + b, 0);
  };

  const getAverageGrade = () => {
    const grades = studyData.subjects.map(subject => subject.grade);
    return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
  };

  const handleAddSubject = () => {
    const subject = {
      id: Date.now(),
      ...newSubject
    };
    setStudyData(prev => ({
      ...prev,
      subjects: [...prev.subjects, subject]
    }));
    setDialogOpen(false);
    setNewSubject({
      name: '',
      grade: '',
      weeklyHours: Array(7).fill(0),
      progress: 0
    });
  };

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    setStudyData(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject =>
        subject.id === selectedSubject.id ? selectedSubject : subject
      )
    }));
    setEditDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این درس مطمئن هستید؟')) {
      setStudyData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(subject => subject.id !== id)
      }));
    }
  };

  const handleHourChange = (subjectId, dayIndex, value) => {
    setStudyData(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              weeklyHours: subject.weeklyHours.map((hour, idx) =>
                idx === dayIndex ? Number(value) : hour
              )
            }
          : subject
      )
    }));
  };

  const WeekInfo = () => (
    <Box mb={2}>
      <Typography variant="subtitle1" color="text.secondary">
        هفته جاری: {studyData.currentWeek}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        از تاریخ {studyData.weekDates[0]} تا {studyData.weekDates[6]}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box p={4} dir="rtl">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              پیگیری مطالعات
            </Typography>
            <Typography color="text.secondary" mb={4}>
              ثبت و مدیریت ساعات مطالعه و نمرات دروس
            </Typography>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          <WeekInfo />
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              جدول ساعات مطالعه هفتگی
            </Typography>
            <StyledButton
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              افزودن درس جدید
            </StyledButton>
          </Box>

          <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <StyledTableCell>درس</StyledTableCell>
                  {studyData.weekDays.map((day, index) => (
                    <StyledTableCell key={index}>
                      {day}
                      <br />
                      <Typography variant="caption">
                        {studyData.weekDates[index]}
                      </Typography>
                    </StyledTableCell>
                  ))}
                  <StyledTableCell>مجموع</StyledTableCell>
                  <StyledTableCell>نمره</StyledTableCell>
                  <StyledTableCell>عملیات</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studyData.subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.name}</TableCell>
                    {subject.weeklyHours.map((hours, index) => (
                      <TableCell key={index} align="center">
                        <TextField
                          type="number"
                          value={hours}
                          size="small"
                          sx={{ width: '60px' }}
                          onChange={(e) => handleHourChange(subject.id, index, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Chip
                        label={`${getTotalHours(subject.weeklyHours)} ساعت`}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={subject.grade}
                        color={subject.grade >= 17 ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditClick(subject)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(subject.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              خلاصه وضعیت دروس
            </Typography>
            <Grid container spacing={3}>
              {studyData.subjects.map((subject) => (
                <Grid item xs={12} md={4} key={subject.id}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {subject.name}
                      </Typography>
                      <Box mt={2}>
                        <Typography variant="body2" mb={1}>
                          پیشرفت درس: {subject.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={subject.progress}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box mt={2} display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          مجموع مطالعه: {getTotalHours(subject.weeklyHours)} ساعت
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          نمره: {subject.grade}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              آمار کلی
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TimerIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {studyData.subjects.reduce((total, subject) => 
                        total + getTotalHours(subject.weeklyHours), 0
                      )}
                    </Typography>
                    <Typography color="text.secondary">
                      ساعات مطالعه هفتگی
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {getAverageGrade()}
                    </Typography>
                    <Typography color="text.secondary">
                      معدل کل
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {studyData.subjects.length}
                    </Typography>
                    <Typography color="text.secondary">
                      تعداد دروس
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>افزودن درس جدید</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="نام درس"
              margin="normal"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="نمره"
              margin="normal"
              type="number"
              value={newSubject.grade}
              onChange={(e) => setNewSubject({ ...newSubject, grade: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="درصد پیشرفت"
              margin="normal"
              type="number"
              value={newSubject.progress}
              onChange={(e) => setNewSubject({ ...newSubject, progress: Number(e.target.value) })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleAddSubject} variant="contained">
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>ویرایش درس</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="نام درس"
              margin="normal"
              value={selectedSubject?.name || ''}
              onChange={(e) => setSelectedSubject({
                ...selectedSubject,
                name: e.target.value
              })}
            />
            <TextField
              fullWidth
              label="نمره"
              margin="normal"
              type="number"
              value={selectedSubject?.grade || ''}
              onChange={(e) => setSelectedSubject({
                ...selectedSubject,
                grade: Number(e.target.value)
              })}
            />
            <TextField
              fullWidth
              label="درصد پیشرفت"
              margin="normal"
              type="number"
              value={selectedSubject?.progress || 0}
              onChange={(e) => setSelectedSubject({
                ...selectedSubject,
                progress: Number(e.target.value)
              })}
            />
            {studyData.weekDays.map((day, index) => (
              <TextField
                key={index}
                fullWidth
                label={`${day} - ${studyData.weekDates[index]}`}
                type="number"
                margin="normal"
                value={selectedSubject?.weeklyHours[index] || 0}
                onChange={(e) => {
                  const newHours = [...selectedSubject.weeklyHours];
                  newHours[index] = Number(e.target.value);
                  setSelectedSubject({
                    ...selectedSubject,
                    weeklyHours: newHours
                  });
                }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleEditSave} variant="contained">
              ذخیره تغییرات
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StudyTracker;