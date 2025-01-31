import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  EventNote as CalendarIcon,
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Notes as NotesIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import jMoment from 'moment-jalaali';

jMoment.loadPersian({ dialect: 'persian-modern' });
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 900,
  margin: '0 auto',
  borderRadius: 16,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}));

const FormIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main
}));

const shiftTypes = [
  { value: 'morning', label: 'صبح (۸ صبح تا ۲ بعد از ظهر)', icon: '🌅' },
  { value: 'evening', label: 'عصر (۲ بعد از ظهر تا ۸ شب)', icon: '🌇' },
  { value: 'night', label: 'شب (۸ شب تا ۸ صبح)', icon: '🌙' }
];

const departments = [
  { value: 'emergency', label: 'اورژانس', icon: '🚑' },
  { value: 'surgery', label: 'جراحی عمومی', icon: '⚕️' },
  { value: 'internal', label: 'داخلی', icon: '👨‍⚕️' },
  { value: 'cardiology', label: 'قلب', icon: '❤️' },
  { value: 'pediatrics', label: 'اطفال', icon: '👶' },
  { value: 'gynecology', label: 'زنان و زایمان', icon: '👩‍⚕️' },
  { value: 'icu', label: 'آی سی یو', icon: '🏥' },
  { value: 'ccu', label: 'سی سی یو', icon: '💉' }
];

const ShiftRegistration = () => {
  const [shiftData, setShiftData] = useState({
    date: jMoment(),
    type: '',
    department: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shiftData.date || !shiftData.type || !shiftData.department) {
      setSnackbar({
        open: true,
        message: 'لطفاً همه فیلدهای ضروری را پر کنید',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSnackbar({
        open: true,
        message: 'شیفت با موفقیت ثبت شد',
        severity: 'success'
      });

      setShiftData({
        date: jMoment(),
        type: '',
        department: '',
        notes: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در ثبت شیفت',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Box mb={4} textAlign="center">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <CalendarIcon sx={{ fontSize: 35 }} />
          ثبت شیفت جدید
        </Typography>
        <Typography color="text.secondary" mt={1}>
          لطفاً اطلاعات شیفت کاری خود را با دقت وارد نمایید
        </Typography>
      </Box>

      <StyledPaper elevation={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
                <DatePicker
                  label="تاریخ شیفت"
                  value={shiftData.date}
                  onChange={(newValue) => setShiftData({ ...shiftData, date: newValue })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <FormIcon>
                          </FormIcon>
                        )
                      }}
                    />
                  )}
                  minDate={jMoment()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>نوع شیفت</InputLabel>
                <Select
                  value={shiftData.type}
                  onChange={(e) => setShiftData({ ...shiftData, type: e.target.value })}
                  label="نوع شیفت"
                  startAdornment={
                    <FormIcon>
                      <TimeIcon />
                    </FormIcon>
                  }
                >
                  {shiftTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{type.icon}</span>
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>بخش</InputLabel>
                <Select
                  value={shiftData.department}
                  onChange={(e) => setShiftData({ ...shiftData, department: e.target.value })}
                  label="بخش"
                  startAdornment={
                    <FormIcon>
                      <HospitalIcon />
                    </FormIcon>
                  }
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{dept.icon}</span>
                        {dept.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="توضیحات (اختیاری)"
                value={shiftData.notes}
                onChange={(e) => setShiftData({ ...shiftData, notes: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <FormIcon sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <NotesIcon />
                    </FormIcon>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                startIcon={loading ? null : <SaveIcon />}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'ثبت شیفت'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
  );
};

export default ShiftRegistration;