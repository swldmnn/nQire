import { deepOrange, grey, lime, pink, teal } from '@mui/material/colors';
import './App.css';
import {
  ThemeProvider,
  createTheme,
} from '@mui/material';
import AppContextProvider from './AppContextProvider';
import MainView from './views/MainView';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
        background: {
          default: '#fff',
          paper: '#eee'
        }
      },
    },
    dark: {
      palette: {
        primary: lime,
        secondary: pink,
        background: {
          default: '#222',
          paper: '#222'
        }
      },
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif !important',
    fontSize: 12,
  },
});

function App() {
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <main>
          <MainView />
        </main>
      </ThemeProvider>
    </AppContextProvider>
  )
}

export default App;
