import { blue, lime } from '@mui/material/colors';
import './App.css';
import Logo from './components/Logo';
import RequestView from './components/RequestView';
import {
  AppBar,
  Grid,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import RequestList from './components/RequestList';
import { HttpRequest, HttpResponse } from './components/types';
import { useState } from 'react';

const requests: HttpRequest[] = [
  {
    label: 'JsonPlaceholder',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: '{"foo":"bar"}',
  },
  {
    label: 'IP API',
    method: 'GET',
    url: 'https://ipapi.co/json',
    body: undefined,
  },
  {
    label: 'Countries',
    method: 'GET',
    url: 'https://restcountries.com/v3.1/all?fields=name,flags',
    body: undefined,
  },
  {
    label: 'ChuckNorrisJoke',
    method: 'GET',
    url: 'https://api.chucknorris.io/jokes/random',
    body: undefined,
  },
  {
    label: 'PokeAPI',
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/pokemon/ditto',
    body: undefined,
  },
  {
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

  const [currentRequest, setCurrentRequest] = useState(requests[0])
  const [currentResponse, setCurrentResponse] = useState({ status: 0, body: undefined } as HttpResponse)

  const changeRequest = (newRequest: HttpRequest) => {
    setCurrentRequest(newRequest)
    setCurrentResponse({ status: 0, body: undefined } as HttpResponse)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <main className="container">
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Logo /><h1 style={{ paddingLeft: "1rem" }}>Welcome to <span style={{ color: "lime" }}>nQire</span></h1>
          </Toolbar>
        </AppBar>

        <Grid container spacing={3}>
          <Grid size={4}>
            <RequestList requests={requests} setRequest={changeRequest}></RequestList>
          </Grid>
          <Grid size={8}>
            <RequestView request={currentRequest} setRequest={setCurrentRequest} response={currentResponse} setResponse={setCurrentResponse} />
          </Grid>

        </Grid>
      </main>
    </ThemeProvider>
  );
}

export default App;
