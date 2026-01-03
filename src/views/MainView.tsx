import { Alert, Box, Snackbar } from "@mui/material"
import TabView from "./TabView"
import { useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import NavigationView from "./NavigationView"
import Backplate from "../components/Backplate";

function MainView() {
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
        <Box>
            <Backplate />
            <Box id='mainView_root' sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100vh',
                boxSizing: 'border-box',
            }}>
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
                        {!!appContext.appState.openItems.length && <TabView />}
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
        </Box>
    )
}

export default MainView