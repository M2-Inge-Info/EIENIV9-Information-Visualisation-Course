import React from 'react';
import { Typography } from '@mui/material';

const Footer = () => {
  return (
    <div style={{
      backgroundColor: '#012F17',
      color: 'white',
      width: '100%',
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography variant="body1">@Walter White</Typography>
    </div>
  );
};

export default Footer;
