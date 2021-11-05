import React, { useState, Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Search from './components/Search';
import { Container } from '@material-ui/core';

function App(){
  return (
    <Container>
      <Grid container justifyContent='center' alignItems='center' spacing={2}>
        <Grid item> 
            <Search />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App;

