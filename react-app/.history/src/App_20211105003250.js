import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';



function App(){

  return (
      <Router >
        <Grid container >
          <div>
            Hello, World
          </div>
          
        </Grid>
      </Router>
  )
}

export default App;

