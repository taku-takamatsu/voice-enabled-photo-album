import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from './components/routes/authentication/UserContext';

const theme = createTheme({
  palette: {
    //type: "dark",
    primary: {
      //main: "#000000"
    },
    secondary: {
      //main: "#424242"
    },
    background: {
      //default: "#FEFFFF"
    }
    //#FEDB61
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <AuthProvider >
        <App />
      </AuthProvider>
  </ThemeProvider>,
  document.getElementById('root')
);