import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Box,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails
} from "@mui/material"
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface RequestListProps {
}

function RequestList({}: RequestListProps) {
    const appContext = useContext(AppContext)

    const openItem = (requestSetIndex: number, requestIndex: number) => {
        appContext.appState.openItems.push(appContext.appState.requestSets[requestSetIndex].requests[requestIndex])
        appContext.updateAppState(appContext.appState)
    }

    return (
        <Box>
            {
                appContext.appState.requestSets.map((requestSet, requestSetIndex) =>
                    <Accordion defaultExpanded disableGutters key={`RequestSet_${requestSetIndex}`}>
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.main',
                            }}
                        >
                            <Typography component="span">{requestSet.label}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {requestSet.requests.map((request, requestIndex) =>
                                    <ListItem key={'RequestListItem' + requestIndex}>
                                        <ListItemButton onDoubleClick={() => openItem(requestSetIndex, requestIndex)}>
                                            <ListItemIcon>
                                                <SwapHorizIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={request.label} />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )}
        </Box>)
}

export default RequestList