import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box } from "@mui/material"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { HttpRequest, HttpRequestResponseProps } from "./types";

interface RequestListProps extends HttpRequestResponseProps {
    requests: HttpRequest[]
}

function RequestList({ requests, setRequest: setSelectedRequest }: RequestListProps) {
    return (
        <Box sx={{
            borderRadius: 1,
            bgcolor: 'grey.900',
        }}>
            <List>
                {requests.map((request, index) =>
                    <ListItem key={'RequestListItem' + index}>
                        <ListItemButton onClick={() => { if (setSelectedRequest) setSelectedRequest(requests[index]) }}>
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