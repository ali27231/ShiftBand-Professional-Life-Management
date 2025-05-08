import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Auth from './components/Auth/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Notifications from './pages/Notifications';
import Exercise from './pages/Exercise';
import FamilyTasks from './pages/FamilyTasks';
import Library from './pages/Library';
import ProgrammingPortfolio from './pages/ProgrammingPortfolio';
import ResponsibilityTasks from './pages/ResponsibilityTasks';
import StudyTracker from './pages/StudyTracker';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/sports"
        element={
          <PrivateRoute>
            <Exercise />
          </PrivateRoute>
        }
      />
      <Route
        path="/family-tasks"
        element={
          <PrivateRoute>
            <FamilyTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/studies"
        element={
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        }
      />
      <Route
        path="/coding"
        element={
          <PrivateRoute>
            <ProgrammingPortfolio />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <ResponsibilityTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/academic"
        element={
          <PrivateRoute>
            <StudyTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <PrivateRoute>
            <Feedback />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;