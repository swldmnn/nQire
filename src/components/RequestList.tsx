import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box } from "@mui/material"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { HttpRequest } from "./types";
import { useContext } from "react";
import { AppContext } from "../AppContext";

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
        <Box sx={{
            borderRadius: 1,
            bgcolor: 'grey.900',
        }}>
            <List>
                {requests.map((request, index) =>
                    <ListItem key={'RequestListItem' + index}>
                        <ListItemButton onDoubleClick={() => openItem(index)}>
                            <ListItemIcon>
                                <PlayCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary={request.label} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>)
}

export default RequestList