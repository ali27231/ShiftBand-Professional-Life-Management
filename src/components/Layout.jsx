import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* برای فاصله از هدر */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;