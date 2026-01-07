import { Box, Button, Divider, Paper, Tab, Tabs, Typography, useColorScheme } from "@mui/material";
import RequestListView from "./RequestListView";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AdjustIcon from '@mui/icons-material/Adjust';
import { useState } from "react";
import EnvironmentListView from "./EnvironmentListView";
import Logo from "../components/Logo";
import { styles } from "../constants";
import EnvironmentChooser from "../components/EnvironmentChooser";
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ImportExportListView from "./ImportExportListView";

type SelectionIndex = number | false

function NavigationView() {
    const { mode, setMode } = useColorScheme();
    const [selectedIndex, setSelectedIndex] = useState(false as SelectionIndex)
    const [lastSelectedIndex, setLastSelectedIndex] = useState(0)

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedIndex(newValue);
        setLastSelectedIndex(newValue)
    };

    const toggleExpandState = () => {
        setSelectedIndex(selectedIndex === false ? lastSelectedIndex : false)
    };

    return (
        <Paper id='navigation_root'
            square
            elevation={1}
            sx={{
                boxSizing: 'border-box',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                zIndex: 50,
            }}>
            <Paper id='navigation_sidebar'
                square
                elevation={4}
                sx={{
                    boxSizing: 'border-box',
                    height: '100%',
                    width: '8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 100,
                }}>

                <Box sx={{ display: 'flex', flexDirection: 'row', padding: styles.spaces.large }}>
                    <Logo sx={{ color: 'primary.main', height: "2rem", width: "2rem", verticalAlign: "bottom" }} />
                    <Typography variant='h5' sx={{ marginLeft: styles.spaces.medium }}>n</Typography>
                    <Typography variant='h5' sx={{ color: 'primary.main' }}>Q</Typography>
                    <Typography variant='h5' >ire</Typography>
                </Box>

                <Divider flexItem />

                <Tabs
                    value={selectedIndex}
                    onChange={handleTabChange}
                    orientation="vertical"
                    scrollButtons="auto"
                    variant="scrollable"
                    sx={{ width: '100%' }}
                >
                    <Tab icon={<PlayArrowIcon />} />
                    <Tab icon={<AdjustIcon />} />
                    <Tab icon={<ImportExportIcon />} />
                </Tabs>

                <Box id='navigation_filler' sx={{ flexGrow: 1 }} />

                <Divider flexItem sx={{ marginBottom: styles.spaces.large }} />

                <Button onClick={() => { setMode(mode === 'dark' ? 'light' : 'dark') }} sx={{ color: 'text.secondary' }}>
                    {mode === 'light' ? <BrightnessHighIcon /> : <BrightnessLowIcon />}
                </Button>
                <EnvironmentChooser sx={{
                    width: '100%',
                    marginBottom: styles.spaces.large,
                    padding: styles.spaces.medium,
                    boxSizing: 'border-box'
                }} />

                <Divider flexItem />

                <Button sx={{ color: 'divider' }} onClick={toggleExpandState}>
                    {selectedIndex === false ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
                </Button>
            </Paper>

            <Divider orientation="vertical" flexItem />

            {selectedIndex !== false && (
                <Box
                    id='navigation_panels'
                    sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}
                >
                    <Box sx={{ width: '18rem' }}>
                        <Box
                            id='navigation_panel_requests'
                            role='tabpanel'
                            hidden={selectedIndex !== 0}
                            display={selectedIndex === 0 ? 'block' : 'none'}
                            sx={{
                                boxSizing: 'border-box',
                                height: '100%',
                                width: '100%',
                            }}>
                            <RequestListView />
                        </Box>
                        <Box
                            id='navigation_panel_environments'
                            role='tabpanel'
                            hidden={selectedIndex !== 1}
                            sx={{
                                boxSizing: 'border-box',
                                height: '100%',
                                width: '100%',
                            }}>
                            <EnvironmentListView />
                        </Box>
                        <Box
                            id='navigation_panel_import_export'
                            role='tabpanel'
                            hidden={selectedIndex !== 2}
                            sx={{
                                boxSizing: 'border-box',
                                height: '100%',
                                width: '100%',
                            }}>
                            <ImportExportListView />
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                </Box>
            )}
        </Paper>
    )
}

export default NavigationView