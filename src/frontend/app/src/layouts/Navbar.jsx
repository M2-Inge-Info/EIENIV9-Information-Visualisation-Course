import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#012F17' }}>
      <Toolbar>
        <Typography variant="h6" style={{ marginLeft: 'auto' }}>
          Walter White
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
