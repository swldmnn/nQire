import { blue, lime } from '@mui/material/colors';
import './App.css';
import Logo from './components/Logo';
import {
  AppBar,
  Grid,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import RequestList from './components/RequestList';
import { HttpRequest } from './components/types';
import MainEditor from './components/MainEditor';
import AppContextProvider from './AppContextProvider';

const requests: HttpRequest[] = [
  {
    typename: 'HttpRequest',
    id: 1,
    label: 'JsonPlaceholder',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: '{"foo":"bar"}',
  },
  {
    typename: 'HttpRequest',
    id: 2,
    label: 'IP API',
    method: 'GET',
    url: 'https://ipapi.co/json',
    body: undefined,
  },
  {
    typename: 'HttpRequest',
    id: 3,
    label: 'Countries',
    method: 'GET',
    url: 'https://restcountries.com/v3.1/all?fields=name,flags',
    body: undefined,
  },
  {
    typename: 'HttpRequest',
    id: 4,
    label: 'ChuckNorrisJoke',
    method: 'GET',
    url: 'https://api.chucknorris.io/jokes/random',
    body: undefined,
  },
  {
    typename: 'HttpRequest',
    id: 5,
    label: 'PokeAPI',
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/pokemon/ditto',
    body: undefined,
  },
  {
    typename: 'HttpRequest',
    id: 6,
    label: 'RestAPI',
    method: 'POST',
    url: 'https://api.restful-api.dev/objects',
    body: '{"name": "Apple MacBook Pro 16","data": {"year": 2019,"price": 1849.99,"CPU model": "Intel Core i9","Hard disk size": "1 TB"}}'
  }
]

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
        <main className="container">
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Logo /><h1 style={{ paddingLeft: "1rem" }}>Welcome to <span style={{ color: "lime" }}>nQire</span></h1>
            </Toolbar>
          </AppBar>

          <Grid container spacing={3}>
            <Grid size={4}>
              <RequestList requests={requests}></RequestList>
            </Grid>

            <Grid size={8}>
              <MainEditor />
            </Grid>
          </Grid>
        </main>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
