import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Badge, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Header */}
        <AppBar position="static" color="secondary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              PropertyManager
            </Typography>
            <IconButton color="inherit" sx={{ mr: 2 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>
              John Smith
            </Typography>
            <Avatar sx={{ bgcolor: 'primary.main' }}>JS</Avatar>
          </Toolbar>
        </AppBar>
        
        {/* Page content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
