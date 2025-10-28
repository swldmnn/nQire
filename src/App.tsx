import { blue, lime } from "@mui/material/colors";
import "./App.css";
import Logo from "./components/Logo";
import RequestView from "./components/RequestView";
import { ThemeProvider, createTheme } from "@mui/material";

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
        <div style={{width:"70%", alignSelf:"center"}}>
          <div className="row">
            <Logo /><h1 style={{paddingLeft: "1rem"}}>Welcome to <span style={{color: "lime"}}>nQire</span></h1>
          </div>
          <RequestView />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
