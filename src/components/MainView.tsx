import { Box, Button, Typography, useColorScheme } from "@mui/material"
import Logo from "./Logo"
import RequestList from "./RequestList"
import TabView from "./TabView"
import { HttpRequest, HttpRequestSet } from "./types"
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import { invoke } from "@tauri-apps/api/core"
import { useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import { HttpRequestSetTransfer } from "./types_transfer"

function MainView() {

    const { mode, setMode } = useColorScheme();
    const appContext = useContext(AppContext)

    useEffect(() => {
        async function getRequestSets() {
            const loadedRequestTransfers = await invoke('find_all_requests', {}) as HttpRequestSetTransfer[];

            const loadedRequests = loadedRequestTransfers.map(requestSetTransfer => {
                return {
                    name: requestSetTransfer.name,
                    requests: requestSetTransfer.requests.map(requestTransfer => {
                        return { ...requestTransfer, typename: 'HttpRequest' } as HttpRequest
                    })
                } as HttpRequestSet
            })

            appContext.appState.requestSets = loadedRequests
            appContext.updateAppState(appContext.appState)
        };

        if (!appContext.appState.requestSets.length) {  //TODO how to handle empty sets
            getRequestSets();
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
                <Logo />
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
                <Box id='mainView_navigation' sx={{
                    width: '20rem',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                }}>
                    <RequestList />
                </Box>

                <Box id='mainView_editor' sx={{
                    display: 'flex',
                    minWidth: 0,
                    minHeight: 0,
                    flexGrow: 1,
                }}>
                    <TabView />
                </Box>
            </Box>
        </Box>
    )
}

export default MainView