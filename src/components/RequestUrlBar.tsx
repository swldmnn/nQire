import { TextField, Button, Select, MenuItem, Box, Divider, Paper } from "@mui/material";
import { HttpRequest, HttpRequestResponseProps } from "../types/types";
import { styles } from "../constants";

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

    return <Box sx={{
        paddingLeft: styles.padding.default,
        paddingRight: styles.padding.default,
        paddingBottom: styles.padding.default,
    }}>
        <Paper elevation={0} variant='outlined' sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            boxSizing: 'border-box',
        }}>
            <Box sx={{
                padding: styles.padding.default,
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
            }}>
                <Select
                    name="httpMethod"
                    value={request?.method}
                    onChange={(e) => onMethodChange(e.target.value)}
                    variant="standard"
                >
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                </Select>

                <Divider orientation="vertical" flexItem sx={{
                    marginLeft: styles.padding.default,
                    marginRight: styles.padding.default
                }} />

                <TextField
                    fullWidth
                    value={request?.url}
                    onChange={(e) => onUrlChange(e.currentTarget.value)}
                    variant="standard"
                />
            </Box>
            <Button
                variant="contained"
                onClick={() => { sendRequest(request) }}
            >Send</Button>
        </Paper>
    </Box>
}

export default RequestUrlBar