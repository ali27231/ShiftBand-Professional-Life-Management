import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  TablePagination,
  TextField,
  Container,
  Card,
  InputAdornment,
  Fade,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import moment from 'moment-jalaali';
import api from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
  overflow: 'hidden'
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  '& .MuiTableCell-body': {
    textAlign: 'right'
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.selected,
  }
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 'bold',
  padding: '4px 8px',
  textTransform: 'uppercase',
  fontSize: '0.75rem'
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  margin: 4,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return { color: '#2e7d32', label: 'تایید شده' };
    case 'pending':
      return { color: '#ed6c02', label: 'در انتظار' };
    case 'rejected':
      return { color: '#d32f2f', label: 'رد شده' };
    default:
      return { color: '#757575', label: status };
  }
};

const MyShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchShifts();
  }, [page, rowsPerPage, search]);

  const fetchShifts = async () => {
    try {
      const response = await api.get('/shifts/my-shifts', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search
        }
      });
      setShifts(response.data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" dir="rtl">
      <Box p={4}>
        <Fade in={true} timeout={1000}>
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              شیفت‌های من
            </Typography>
            <Typography color="text.secondary">
              مدیریت و مشاهده شیفت‌های کاری شما
            </Typography>
          </Box>
        </Fade>

        <Box mb={4}>
          <SearchTextField
            fullWidth
            placeholder="جستجو در شیفت‌ها..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <StyledCard><StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>تاریخ و زمان</TableCell>
                  <TableCell>نوع شیفت</TableCell>
                  <TableCell>بخش</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography>
                          {moment(shift.date).format('jYYYY/jMM/jDD')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TimeIcon fontSize="small" color="action" />
                        <Typography>{shift.type}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{shift.department}</TableCell>
                    <TableCell>
                      <StatusChip
                        label={getStatusColor(shift.status).label}
                        style={{
                          backgroundColor: `${getStatusColor(shift.status).color}15`,
                          color: getStatusColor(shift.status).color
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="ویرایش">
                        <ActionButton color="primary">
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <ActionButton color="error">
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <Box p={2}>
            <TablePagination
              component="div"
              count={shifts.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="تعداد در صفحه"
              dir="ltr"
            />
          </Box>
        </StyledCard>
      </Box>
    </Container>
  );
};

export default MyShifts;