import { deepOrange, lime, pink, teal } from '@mui/material/colors'
import './App.css'
import {
  ThemeProvider,
  createTheme,
} from '@mui/material'
import MainView from './views/MainView'
import AppContextProvider from './AppContextProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

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
          default: '#111',
          paper: '#111'
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
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <main>
            <MainView />
          </main>
        </AppContextProvider>
      </QueryClientProvider>
    </ThemeProvider >
  )
}

export default App
