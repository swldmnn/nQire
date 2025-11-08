import { green, lightGreen, lime, pink } from '@mui/material/colors';
import './App.css';
import {
  ThemeProvider,
  createTheme,
} from '@mui/material';
import AppContextProvider from './AppContextProvider';
import MainView from './components/MainView';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: lightGreen,
        secondary: pink,
      },
    },
    dark: {
      palette: {
        primary: lime,
        secondary: pink,
      },
    },
  },
});

function App() {
  /*
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
    palette: {
      primary: lime,
      secondary: pink,
    },
    typography: {
      fontFamily: 'Arial, Helvetica, sans-serif !important',
      fontSize: 12,
    },
  });
*/
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <main>
          <MainView />
        </main>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
