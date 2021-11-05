import React, { useState, Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Search from './components/Search';
function App(){
  return (
    <Grid container justifyContent='center' alignItems='center' spacing={2}>
      <Grid item> 
          <Search />
      </Grid>
      
    </Grid>
  )
}

export default App;

