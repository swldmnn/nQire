import { Alert, Box, Button, Paper, Snackbar, Typography, useColorScheme } from "@mui/material"
import Logo from "../components/Logo"
import TabView from "./TabView"
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import { useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import NavigationView from "./NavigationView"
import Backplate from "../components/Backplate";
import EnvironmentChooser from "../components/EnvironmentChooser";

function MainView() {
    const { mode, setMode } = useColorScheme();
    const appContext = useContext(AppContext)

    useEffect(() => {
        if (!appContext.appState.initialized) {
            appContext.initialize()
        }
    }, []);


    const onCloseSnackbar = () => {
        appContext.hideNotification()
    }

    return (
        <Box id='mainView_root' sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
        }}>
            <Paper id='mainView_header' elevation={3} square={true} sx={{
                display: 'flex',
                padding: '.5rem',
                width: '100%',
                boxSizing: 'border-box',
                zIndex: 999
            }}>
                <Logo sx={{ color: 'primary.main', height: "2rem", width: "2rem", verticalAlign: "bottom" }} />
                <Typography variant='h5' sx={{ marginLeft: '.5rem' }}>n</Typography>
                <Typography variant='h5' sx={{ color: 'primary.main' }}>Q</Typography>
                <Typography variant='h5' >ire</Typography>
                <EnvironmentChooser sx={{ marginLeft: 'auto', marginRight: '1rem' }} />
                <Button onClick={() => { setMode(mode === 'dark' ? 'light' : 'dark') }}>
                    {mode === 'light' ? <BrightnessHighIcon /> : <BrightnessLowIcon />}
                </Button>
            </Paper>

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
            <Snackbar
                key={'notification'}
                open={appContext.appState.notification.open}
                autoHideDuration={appContext.appState.notification.closeAfterMillis}
                onClose={onCloseSnackbar}
                message={appContext.appState.notification.message}
            >
                <Alert
                    onClose={onCloseSnackbar}
                    severity={appContext.appState.notification.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {appContext.appState.notification.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default MainView