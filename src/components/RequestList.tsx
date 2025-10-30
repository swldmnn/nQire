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
import NearMeIcon from '@mui/icons-material/NearMe';
import { HttpRequest } from "./types";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface RequestListProps {
    requests: HttpRequest[]
}

function RequestList({ requests }: RequestListProps) {
    const appContext = useContext(AppContext)

    const openItem = (index: number) => {
        appContext.appState.openItems.push(requests[index])
        appContext.updateAppState(appContext.appState)
    }

    return (
        <Box>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Sample requests</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {requests.map((request, index) =>
                            <ListItem key={'RequestListItem' + index}>
                                <ListItemButton onDoubleClick={() => openItem(index)}>
                                    <ListItemIcon>
                                        <NearMeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={request.label} />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>)
}

export default RequestList