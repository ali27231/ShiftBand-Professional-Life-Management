import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  maxWidth: 800,
  margin: '0 auto',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
}));

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    personalCode: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        specialization: user.specialization || '',
        personalCode: user.personalCode || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setSnackbar({
        open: true,
        message: 'پروفایل با موفقیت به‌روزرسانی شد',
        severity: 'success'
      });
      setEditing(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در به‌روزرسانی پروفایل',
        severity: 'error'
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'رمز عبور جدید با تکرار آن مطابقت ندارد',
        severity: 'error'
      });
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSnackbar({
        open: true,
        message: 'رمز عبور با موفقیت تغییر کرد',
        severity: 'success'
      });
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در تغییر رمز عبور',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={5}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
          پروفایل کاربری
        </Typography>

        <StyledPaper elevation={0}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box position="relative" mb={2}>
              <ProfileAvatar src={user?.profileImage} />
              <IconButton
                color="primary"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}>
                <PhotoCameraIcon />
              </IconButton>
            </Box>

            <Button
              variant={editing ? "contained" : "outlined"}
              startIcon={editing ? <SaveIcon /> : <EditIcon />}
              onClick={() => editing ? handleProfileUpdate() : setEditing(true)}
              sx={{ borderRadius: 2, mb: 3 }}
            >
              {editing ? 'ذخیره تغییرات' : 'ویرایش اطلاعات'}
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="نام و نام خانوادگی"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!editing}
                InputProps={{
                  startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ایمیل"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!editing}
                InputProps={{
                  startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="شماره تماس"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!editing}
                InputProps={{
                  startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="کد پرسنلی"
                value={profileData.personalCode}
                disabled
                InputProps={{
                  startAdornment: <BadgeIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="بخش"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                disabled={!editing}
                InputProps={{
                  startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="تخصص"
                value={profileData.specialization}
                onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                disabled={!editing}
                InputProps={{
                  startAdornment: <WorkIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setOpenPasswordDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              تغییر رمز عبور
            </Button>
          </Box>
        </StyledPaper>

        <Dialog
          open={openPasswordDialog}
          onClose={() => setOpenPasswordDialog(false)}
          PaperProps={{
            sx: { borderRadius: 2, p: 2 }
          }}
        >
          <DialogTitle>تغییر رمز عبور</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              type="password"label="رمز عبور فعلی"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              type="password"
              label="رمز عبور جدید"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="تکرار رمز عبور جدید"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>
              انصراف
            </Button>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              sx={{ borderRadius: 2 }}
            >
              تایید
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Profile;