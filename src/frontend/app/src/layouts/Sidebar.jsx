import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

const Sidebar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const menuItems = [
    { label: 'Home', path: '/', icon: <MapIcon /> },
    { label: 'Map', path: '/map', icon: <MapIcon /> },
    { label: 'All', path: '/all', icon: <AllInboxIcon /> },
    { label: 'Equipements', path: '/equipements', icon: <BuildIcon /> },
    { label: 'Bo', path: '/bo', icon: <BusinessIcon /> },
  ];

  return (
    <>
      {isMobile && (
        <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer}
        PaperProps={{
          style: {
            width: isMobile ? '100%' : '300px',
            backgroundColor: '#012F17',
            color: 'white',
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!isMobile && <ListItemText primary={item.label} />}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
