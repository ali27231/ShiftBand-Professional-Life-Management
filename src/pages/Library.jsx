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
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  IconButton,
  Alert,
  Snackbar,
  Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MenuBook as BookIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  LocalLibrary as LibraryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
  Event as EventIcon
} from '@mui/icons-material';

// Styled Components
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

const Library = () => {
  // Initial Data Structure
  const initialData = {
    books: {
      reading: [
        {
          id: 1,
          title: "صد سال تنهایی",
          author: "گابریل گارسیا مارکز",
          pages: 432,
          progress: 65,
          status: "reading"
        },
        {
          id: 2,
          title: "کیمیاگر",
          author: "پائولو کوئیلو",
          pages: 208,
          progress: 30,
          status: "reading"
        }
      ],
      completed: [
        {
          id: 3,
          title: "بوف کور",
          author: "صادق هدایت",
          pages: 148,
          progress: 100,
          status: "completed",
          completionDate: "2023-08-15",
          rating: 4
        },
        {
          id: 4,
          title: "شازده کوچولو",
          author: "آنتوان دو سنت اگزوپری",
          pages: 136,
          progress: 100,
          status: "completed",
          completionDate: "2023-07-20",
          rating: 5
        }
      ],
      toRead: [
        {
          id: 5,
          title: "جنایت و مکافات",
          author: "فئودور داستایوفسکی",
          pages: 671,
          status: "toRead"
        }
      ]
    },
    todos: [],
    stats: {
      totalBooks: 5,
      pagesRead: 284,
      dailyReadingMinutes: 45,
      currentStreak: 7
    },
    schedule: {
      daily: [],
      weekly: []
    }
  };

  // States
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('libraryData');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'toRead',
    pages: '',
    progress: 0
  });

  const [newScheduleItem, setNewScheduleItem] = useState({
    day: '',
    time: '',
    duration: '',
    book: '',
    type: 'daily'
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('libraryData', JSON.stringify(data));
  }, [data]);

  // Handlers
  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) {
      setSnackbar({
        open: true,
        message: 'لطفا تمام فیلدهای ضروری را پر کنید',
        severity: 'error'
      });
      return;
    }

    const book = {
      id: Date.now(),
      ...newBook,
      addedDate: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      books: {
        ...prev.books,
        [newBook.status]: [...prev.books[newBook.status], book]
      },
      stats: {
        ...prev.stats,
        totalBooks: prev.stats.totalBooks + 1
      }
    }));

    setDialogOpen(false);
    setNewBook({ title: '', author: '', status: 'toRead', pages: '', progress: 0 });
    setSnackbar({
      open: true,
      message: 'کتاب با موفقیت اضافه شد',
      severity: 'success'
    });
  };

  const handleEditBook = () => {
    if (!selectedItem) return;

    // Remove from old status array
    const oldStatusBooks = data.books[selectedItem.status].filter(
      book => book.id !== selectedItem.id
    );

    // Add to new status array (if status changed)
    setData(prev => ({
      ...prev,
      books: {
        ...prev.books,
        [selectedItem.status]: [...oldStatusBooks, selectedItem]
      }
    }));

    setEditDialog(false);
    setSelectedItem(null);
    setSnackbar({
      open: true,
      message: 'کتاب با موفقیت ویرایش شد',
      severity: 'success'
    });
  };

  const handleDeleteBook = () => {
    if (!selectedItem) return;

    setData(prev => ({
      ...prev,
      books: {
        ...prev.books,
        [selectedItem.status]: prev.books[selectedItem.status].filter(
          book => book.id !== selectedItem.id
        )
      },
      stats: {
        ...prev.stats,
        totalBooks: prev.stats.totalBooks - 1
      }
    }));

    setDeleteDialog(false);
    setSelectedItem(null);
    setSnackbar({
      open: true,
      message: 'کتاب با موفقیت حذف شد',
      severity: 'success'
    });
  };

  const handleAddScheduleItem = () => {
    if (!newScheduleItem.book || !newScheduleItem.time || !newScheduleItem.duration) {
      setSnackbar({
        open: true,
        message: 'لطفا تمام فیلدهای ضروری را پر کنید',
        severity: 'error'
      });
      return;
    }

    const scheduleItem = {
      id: Date.now(),
      ...newScheduleItem
    };

    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [newScheduleItem.type]: [...prev.schedule[newScheduleItem.type], scheduleItem]
      }
    }));

    setScheduleDialog(false);
    setNewScheduleItem({
      day: '',
      time: '',
      duration: '',
      book: '',
      type: 'daily'
    });
    setSnackbar({
      open: true,
      message: 'برنامه مطالعه با موفقیت اضافه شد',
      severity: 'success'
    });
  };

  const handleUpdateProgress = (bookId, newProgress) => {
    setData(prev => ({
      ...prev,
      books: {
        ...prev.books,
        reading: prev.books.reading.map(book =>
          book.id === bookId ? { ...book, progress: newProgress } : book
        )
      }
    }));
  };

  // UI Component
  return (
    <Container maxWidth="md">
      <Box p={4} dir="rtl">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={4}>
            <LibraryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              کتابخانه من
            </Typography>
            <Typography color="text.secondary" mb={4}>
              مدیریت و پیگیری مطالعات
            </Typography>
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          {/* Reading Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              در حال مطالعه
            </Typography>
            <StyledButton
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              افزودن کتاب
            </StyledButton>
          </Box>

          <Grid container spacing={3}>
            {data.books.reading.map((book) => (
              <Grid item xs={12} md={6} key={book.id}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6" gutterBottom>
                        {book.title}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedItem(book);
                            setEditDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedItem(book);
                            setDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {book.author}
                    </Typography>
                    <Box mt={2}>
                      <Typography variant="body2" mb={1}>
                        پیشرفت: {book.progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={book.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Completed Books Section */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              کتاب‌های خوانده شده
            </Typography>
            
            <Grid container spacing={3}>
              {data.books.completed.map((book) => (
                <Grid item xs={12} md={6} key={book.id}>
                  <StyledCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" gutterBottom>
                          {book.title}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedItem(book);
                              setEditDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedItem(book);
                              setDeleteDialog(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography color="text.secondary" gutterBottom>
                        {book.author}
                      </Typography>
                      <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                          تعداد صفحات: {book.pages}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          تاریخ اتمام: {new Date(book.completionDate).toLocaleDateString('fa-IR')}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          <Typography variant="body2" mr={1}>
                            امتیاز:
                          </Typography>
                          <Rating
                            value={book.rating}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Chip 
                        label="تکمیل شده" 
                        color="success" 
                        size="small" 
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Schedule Section */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              برنامه مطالعاتی
            </Typography>
            <StyledButton
              startIcon={<TimeIcon />}
              variant="contained"
              onClick={() => setScheduleDialog(true)}
              sx={{ mb: 3 }}
            >
              افزودن برنامه
            </StyledButton>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      برنامه روزانه
                    </Typography>
                    <List>
                      {data.schedule.daily.map((item) => (
                        <ListItem
                          key={item.id}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => {
                              setSelectedItem(item);
                              setDeleteDialog(true);
                            }}>
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={item.book}
                            secondary={`${item.time} - ${item.duration} دقیقه`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      برنامه هفتگی
                    </Typography>
                    <List>
                      {data.schedule.weekly.map((item) => (
                        <ListItem
                          key={item.id}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => {
                              setSelectedItem(item);
                              setDeleteDialog(true);
                            }}>
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={`${item.book} - ${item.day}`}
                            secondary={`${item.time} - ${item.duration} دقیقه`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Stats Section */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              آمار مطالعه
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <BookIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.stats.totalBooks}
                  </Typography>
                  <Typography color="text.secondary">
                    کتاب‌های خوانده شده
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <TimelineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.stats.pagesRead}
                  </Typography>
                  <Typography color="text.secondary">
                    صفحات مطالعه شده
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <TimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.stats.dailyReadingMinutes}
                  </Typography>
                  <Typography color="text.secondary">
                    دقیقه مطالعه روزانه
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <TimelineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.stats.currentStreak}
                  </Typography>
                  <Typography color="text.secondary">
                    روزهای متوالی مطالعه
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>

        {/* Dialogs */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>افزودن کتاب جدید</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="نام کتاب"
              margin="normal"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="نویسنده"
              margin="normal"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <TextField
              fullWidth
              label="تعداد صفحات"
              type="number"
              margin="normal"
              value={newBook.pages}
              onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>وضعیت</InputLabel>
              <Select
                value={newBook.status}
                onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
              >
                <MenuItem value="toRead">برای خواندن</MenuItem>
                <MenuItem value="reading">در حال خواندن</MenuItem>
                <MenuItem value="completed">خوانده شده</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleAddBook} variant="contained">
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
          <DialogTitle>ویرایش کتاب</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="نام کتاب"
              margin="normal"
              value={selectedItem?.title || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="نویسنده"
              margin="normal"
              value={selectedItem?.author || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, author: e.target.value })}
            />
            <TextField
              fullWidth
              label="تعداد صفحات"
              type="number"
              margin="normal"
              value={selectedItem?.pages || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, pages: e.target.value })}
            />
            <TextField
              fullWidth
              label="درصد پیشرفت"
              type="number"
              margin="normal"
              value={selectedItem?.progress || 0}
              onChange={(e) => setSelectedItem({ 
                ...selectedItem, 
                progress: Math.min(100, Math.max(0, parseInt(e.target.value))) 
              })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>وضعیت</InputLabel>
              <Select
                value={selectedItem?.status || ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
              >
                <MenuItem value="toRead">برای خواندن</MenuItem>
                <MenuItem value="reading">در حال خواندن</MenuItem>
                <MenuItem value="completed">خوانده شده</MenuItem>
              </Select>
            </FormControl>
            {selectedItem?.status === 'completed' && (
              <Box mt={2}>
                <Typography gutterBottom>امتیاز</Typography>
                <Rating
                  value={selectedItem?.rating || 0}
                  onChange={(e, newValue) => setSelectedItem({ ...selectedItem, rating: newValue })}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={handleEditBook} variant="contained">
              ذخیره تغییرات
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={scheduleDialog} onClose={() => setScheduleDialog(false)}>
          <DialogTitle>افزودن برنامه مطالعه</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>نوع برنامه</InputLabel>
              <Select
                value={newScheduleItem.type}
                onChange={(e) => setNewScheduleItem({...newScheduleItem, type: e.target.value})}
              >
                <MenuItem value="daily">روزانه</MenuItem>
                <MenuItem value="weekly">هفتگی</MenuItem>
              </Select>
            </FormControl>

            {newScheduleItem.type === 'weekly' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>روز هفته</InputLabel>
                <Select
                  value={newScheduleItem.day}
                  onChange={(e) => setNewScheduleItem({...newScheduleItem, day: e.target.value})}
                >
                  <MenuItem value="شنبه">شنبه</MenuItem>
                  <MenuItem value="یکشنبه">یکشنبه</MenuItem>
                  <MenuItem value="دوشنبه">دوشنبه</MenuItem>
                  <MenuItem value="سه‌شنبه">سه‌شنبه</MenuItem>
                  <MenuItem value="چهارشنبه">چهارشنبه</MenuItem>
                  <MenuItem value="پنج‌شنبه">پنج‌شنبه</MenuItem>
                  <MenuItem value="جمعه">جمعه</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              label="ساعت"
              margin="normal"
              value={newScheduleItem.time}
              onChange={(e) => setNewScheduleItem({...newScheduleItem, time: e.target.value})}
            />

            <TextField
              fullWidth
              label="مدت (دقیقه)"
              type="number"
              margin="normal"
              value={newScheduleItem.duration}
              onChange={(e) => setNewScheduleItem({...newScheduleItem, duration: e.target.value})}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>کتاب</InputLabel>
              <Select
                value={newScheduleItem.book}
                onChange={(e) => setNewScheduleItem({...newScheduleItem, book: e.target.value})}
              >
                {data.books.reading.map(book => (
                  <MenuItem key={book.id} value={book.title}>{book.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialog(false)}>انصراف</Button>
            <Button onClick={handleAddScheduleItem} variant="contained">
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>حذف آیتم</DialogTitle>
          <DialogContent>
            <DialogContentText>
              آیا از حذف این آیتم اطمینان دارید؟
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>انصراف</Button>
            <Button onClick={handleDeleteBook} color="error" variant="contained">
              حذف
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default Library;