import React, { useState, Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Search from './components/Search';
import { Container, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import SearchResults from './components/SearchResults';
import UploadImage from './components/UploadImage';

const useStyles = makeStyles({
  searchGrid : {
      margin : '20px',
  }
})

function App(){
  const [ itemData, setItemData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const classes = useStyles();

  return (
      <Container maxWidth='md' style={{marginTop : 22}} >
        <Grid container spacing={2} justifyContent='center' alignItems='center' >
          <Grid item xs={12}> 
            <Search setItemData={setItemData} setLoading={setLoading}/>
          </Grid>
          <Grid item xs={12}>
            <UploadImage />
          </Grid>
          <Grid item xs={12}>
            <SearchResults itemData={itemData} loading={loading}/>
          </Grid>
        </Grid>
      </Container>
  )
}

export default App;

