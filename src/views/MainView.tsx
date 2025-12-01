import { Box, Button, Typography, useColorScheme } from "@mui/material"
import Logo from "../components/Logo"
import TabView from "./TabView"
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import { useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import NavigationView from "./NavigationView"
import Backplate from "../components/Backplate";

function MainView() {
    const { mode, setMode } = useColorScheme();
    const appContext = useContext(AppContext)

    useEffect(() => {
        if (!appContext.appState.initialized) {
            appContext.initialize()
        }
    }, []);

    return (
        <Box id='mainView_root' sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
        }}>
            <Box id='mainView_header' sx={{
                display: 'flex',
                padding: '.8rem',
                width: '100%',
                boxSizing: 'border-box',
                bgcolor: 'grey.800',
                boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2)'
            }}>
                <Logo sx={{ color: 'primary.main', height: "2rem", width: "2rem", verticalAlign: "bottom" }} />
                <Typography variant='h5' sx={{ marginLeft: '.5rem' }}>n</Typography>
                <Typography variant='h5' sx={{ color: 'primary.main' }}>Q</Typography>
                <Typography variant='h5' >ire</Typography>
                <Button sx={{ marginLeft: 'auto' }} onClick={() => { setMode(mode === 'dark' ? 'light' : 'dark') }}>
                    {mode === 'light' ? <BrightnessHighIcon /> : <BrightnessLowIcon />}
                </Button>
            </Box>

            <Box id='mainView_content' sx={{
                display: 'flex',
                flexGrow: 1,
                minWidth: 0,
                minHeight: 0,
                boxSizing: 'border-box',
            }}>
                <NavigationView />
                <Box id='mainView_editor' sx={{
                    display: 'flex',
                    minWidth: 0,
                    minHeight: 0,
                    flexGrow: 1,
                }}>
                    {appContext.appState.openItems.length ? <TabView /> : <Backplate />}
                </Box>
            </Box>
        </Box>
    )
}

export default MainView