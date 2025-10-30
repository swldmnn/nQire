import { blue, lime } from '@mui/material/colors';
import './App.css';
import {
  ThemeProvider,
  createTheme,
} from '@mui/material';
import AppContextProvider from './AppContextProvider';
import MainView from './components/MainView';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: lime,
      secondary: blue,
    },
  });

  return (
    <AppContextProvider>
      <ThemeProvider theme={darkTheme}>
        <main>
          <MainView />
        </main>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
