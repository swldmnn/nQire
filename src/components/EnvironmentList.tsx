import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AdjustIcon from '@mui/icons-material/Adjust';
import { useContext } from "react";
import { AppContext } from "../AppContext";

function EnvironmentList() {
    const appContext = useContext(AppContext)

    const openItem = (environmentIndex: number) => {
        appContext.appState.openItems.push(appContext.appState.environments[environmentIndex])
        appContext.appState.selectedTabIndex = appContext.appState.openItems.length - 1
        appContext.updateAppState(appContext.appState)
    }

    return (
        <Box>
            <Accordion defaultExpanded disableGutters key={`Environments`}>
                <AccordionSummary
                    expandIcon={<KeyboardArrowDownIcon />}
                    sx={{
                        flexDirection: 'row-reverse',
                        color: 'primary.main',
                    }}
                >
                    <Typography component="span">Environments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {appContext.appState.environments.map((environment, index) =>
                            <ListItem key={`EnvironmentListItem_${index}`}>
                                <ListItemButton onDoubleClick={() => { openItem(index) }}>
                                    <ListItemIcon>
                                        <AdjustIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={environment.label} />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>)
}

export default EnvironmentList