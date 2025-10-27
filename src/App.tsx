import "./App.css";
import ResponseView from "./components/ResponseView";
import RequestView from "./components/RequestView";
import { ThemeProvider, createTheme } from "@mui/material";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <main className="container">
        <div style={{width:"70%", alignSelf:"center"}}>
          <h1>Welcome to nQire</h1>
          <RequestView />
          <br /><br />
          <ResponseView />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
