import { deepOrange, lime, pink, teal } from '@mui/material/colors';
import './App.css';
import {
  ThemeProvider,
  createTheme,
} from '@mui/material';
import MainView from './views/MainView';
import GlobalContextProvider from './GlobalContextProvider';

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
    <ThemeProvider theme={theme}>
      <GlobalContextProvider>
        <main>
          <MainView />
        </main>
      </GlobalContextProvider>
    </ThemeProvider>
  )
}

export default App;
