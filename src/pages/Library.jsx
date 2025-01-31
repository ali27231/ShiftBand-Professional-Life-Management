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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MenuBook as BookIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
  LocalLibrary as LibraryIcon
} from '@mui/icons-material';

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
  const [books, setBooks] = useState({
    reading: [
      { id: 1, title: 'صد سال تنهایی', author: 'گابریل گارسیا مارکز', progress: 65 },
      { id: 2, title: 'کیمیاگر', author: 'پائولو کوئلیو', progress: 30 }
    ],
    completed: [
      { id: 3, title: '1984', author: 'جورج اورول', rating: 5 },
      { id: 4, title: 'بوف کور', author: 'صادق هدایت', rating: 4 }
    ],
    toRead: [
      { id: 5, title: 'شازده کوچولو', author: 'آنتوان دو سنت‌اگزوپری' },
      { id: 6, title: 'جنایات و مکافات', author: 'فئودور داستایوفسکی' }
    ]
  });

  const [todos, setTodos] = useState([
    { text: 'خواندن 30 صفحه از کیمیاگر', completed: false },
    { text: 'مرور یادداشت‌های صد سال تنهایی', completed: true },
    { text: 'خرید کتاب جدید', completed: false }
  ]);

  const [stats, setStats] = useState({
    totalBooks: 15,
    pagesRead: 3240,
    dailyReadingMinutes: 45,
    currentStreak: 8
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'toRead'
  });

  const handleAddBook = () => {
    const book = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author
    };

    setBooks(prev => ({
      ...prev,
      [newBook.status]: [...prev[newBook.status], book]
    }));

    setDialogOpen(false);
    setNewBook({ title: '', author: '', status: 'toRead' });
  };

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
            {books.reading.map((book) => (
              <Grid item xs={12} md={6} key={book.id}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {book.title}
                    </Typography>
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

          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              کتاب‌های خوانده شده
            </Typography>
            <Grid container spacing={2}>
              {books.completed.map((book) => (
                <Grid item xs={12} key={book.id}>
                  <StyledCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle1">{book.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {book.author}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${book.rating}/5`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              برنامه مطالعه امروز
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
              آمار مطالعه
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <BookIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalBooks}
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
                    {stats.pagesRead}
                  </Typography>
                  <Typography color="text.secondary">
                    صفحات مطالعه شده
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <LibraryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {stats.dailyReadingMinutes}
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
                    {stats.currentStreak}
                  </Typography>
                  <Typography color="text.secondary">
                    روزهای متوالی مطالعه
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>

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
      </Box>
    </Container>
  );
};

export default Library;