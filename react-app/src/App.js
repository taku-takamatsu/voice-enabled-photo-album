import React, { useState, Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Transcribe from './components/Transcribe';
import { Container } from '@material-ui/core';

function App(){
  return (
    <Container>
      <Grid container justifyContent='center' alignItems='center' spacing={2}>
        <Grid item> 
          <Transcribe/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App;

