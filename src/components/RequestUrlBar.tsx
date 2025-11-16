import { TextField, Button, Select, MenuItem, Box, Card } from "@mui/material";
import { HttpRequest, HttpRequestResponseProps } from "./types";

interface RequestUrlBarProps extends HttpRequestResponseProps {
    sendRequest: (request?: HttpRequest) => void
}

function RequestUrlBar({ request, setRequest, sendRequest }: RequestUrlBarProps) {
    if (!request || !setRequest) {
        return null
    }

    const onMethodChange = (newValue: string) => {
        setRequest({ ...request, method: newValue })
    }

    const onUrlChange = (newValue: string) => {
        setRequest({ ...request, url: newValue })
    }

    return <Card>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Select
                name="httpMethod"
                value={request?.method}
                onChange={(e) => onMethodChange(e.target.value)}
            >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
            </Select>

            <TextField
                fullWidth
                value={request?.url}
                onChange={(e) => onUrlChange(e.currentTarget.value)}
            />
            <Button variant="contained" onClick={() => { sendRequest(request) }}>Send</Button>
        </Box>
    </Card>
}

export default RequestUrlBar