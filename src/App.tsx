import { blue, lime } from "@mui/material/colors";
import "./App.css";
import Logo from "./components/Logo";
import RequestView from "./components/RequestView";
import { 
  AppBar, 
  ThemeProvider, 
  Toolbar, 
  createTheme, 
} from "@mui/material";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: lime,
      secondary: blue,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <main className="container">
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Logo /><h1 style={{paddingLeft: "1rem"}}>Welcome to <span style={{color: "lime"}}>nQire</span></h1>
          </Toolbar>
        </AppBar>

        <div style={{width:"70%", alignSelf:"center"}}>
          <RequestView />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
