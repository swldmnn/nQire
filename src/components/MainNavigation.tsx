import { Box, Button, Divider, Tab, Tabs } from "@mui/material";
import RequestList from "./RequestList";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AdjustIcon from '@mui/icons-material/Adjust';
import { useState } from "react";
import EnvironmentList from "./EnvironmentList";

type SelectionIndex = number | false

function MainNavigation() {
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
        <Box
            id='navigation_root'
            sx={{
                boxSizing: 'border-box',
                height: '100%',
                display: 'flex',
                flexDirection: 'row'
            }}>
            <Box
                id='navigation_sidebar'
                sx={{
                    boxSizing: 'border-box',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <Tabs
                    value={selectedIndex}
                    onChange={handleTabChange}
                    orientation="vertical"
                    sx={{ width: '100%' }}
                >
                    <Tab icon={<SwapHorizIcon />} />
                    <Tab icon={<AdjustIcon />} />
                </Tabs>

                <Box id='navigation_filler' sx={{ flexGrow: 1 }} />
                <Divider flexItem />

                <Button
                    sx={{ color: 'divider' }}
                    onClick={toggleExpandState}
                >
                    {selectedIndex === false ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
                </Button>
            </Box>

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
                            <RequestList />
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
                            <EnvironmentList />
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                </Box>
            )}
        </Box>
    )
}

export default MainNavigation