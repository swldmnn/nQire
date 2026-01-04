import { Alert, Box, Snackbar } from "@mui/material"
import TabView from "./TabView"
import { useEffect } from "react"
import NavigationView from "./NavigationView"
import Backplate from "../components/Backplate"
import { useNotification } from "../contexts/notification/useNotification"
import { useItems } from "../contexts/items/useItems"

function MainView() {
    const notificationContext = useNotification()
    const itemsContext = useItems()

    useEffect(() => {
        const loadItems = async () => {
            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
        }

        loadItems()
    }, []);


    const onCloseSnackbar = () => {
        notificationContext.dispatch({ type: 'HIDE' })
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
                        <TabView />
                    </Box>
                </Box>
                <Snackbar
                    key={'notification'}
                    open={notificationContext.state.showNotification}
                    autoHideDuration={notificationContext.state.notification.closeAfterMillis}
                    onClose={onCloseSnackbar}
                    message={notificationContext.state.notification.message}
                >
                    <Alert
                        onClose={onCloseSnackbar}
                        severity={notificationContext.state.notification.type}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {notificationContext.state.notification.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    )
}

export default MainView