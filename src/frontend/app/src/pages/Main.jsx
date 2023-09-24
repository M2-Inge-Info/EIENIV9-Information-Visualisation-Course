import React from 'react'
import Sidebar from '../layouts/Sidebar'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import { Container, Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Main = () => {
  return (<>
    <Router>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', backgroundColor: 'darkblue', color: 'white' }}>
          <Sidebar />
          <Container maxWidth="xl" style={{ flex: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                hello
                {/* <Switch>
                  <Route path="/" exact component={HomePage} />
                  <Route path="/map" component={MapPage} />
                  <Route path="/all" component={AllPage} />
                  <Route path="/equipements" component={EquipementsPage} />
                  <Route path="/bo" component={BoPage} />
                </Switch> */}
              </Grid>
            </Grid>
          </Container>
        </div>
        <Footer />
      </div>
    </Router>
  </>);
}

export default Main