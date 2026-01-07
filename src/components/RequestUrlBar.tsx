import { TextField, Button, Select, MenuItem, Box, Divider, Paper, useColorScheme } from "@mui/material";
import { HttpRequest, HttpRequestResponseProps } from "../types/types";
import { styles } from "../constants";

interface RequestUrlBarProps extends HttpRequestResponseProps {
    sendRequest: (request?: HttpRequest) => void
}

function RequestUrlBar({ request, setRequest, sendRequest }: RequestUrlBarProps) {
    if (!request || !setRequest) {
        return null
    }

    const { mode } = useColorScheme();
    const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

    const onMethodChange = (newValue: string) => {
        setRequest({ ...request, method: newValue })
    }

    const onUrlChange = (newValue: string) => {
        setRequest({ ...request, url: newValue })
    }

    return <Box sx={{
        paddingLeft: styles.spaces.medium,
        paddingRight: styles.spaces.medium,
        paddingBottom: styles.spaces.medium,
    }}>
        <Paper elevation={0} variant='outlined' sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
        }}>
            <Box sx={{
                padding: styles.spaces.medium,
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
            }}>
                <Select
                    name="httpMethod"
                    value={request?.method}
                    onChange={(e) => onMethodChange(e.target.value)}
                    variant="standard"
                    className={`http-${request.method.toLowerCase()} ${themeClass}`}
                    disableUnderline
                    sx={{fontWeight: 'bold'}}
                >
                    <MenuItem value="GET" className={`http-get ${themeClass}`} sx={{fontWeight: 'bold'}}>GET</MenuItem>
                    <MenuItem value="POST" className={`http-post ${themeClass}`} sx={{fontWeight: 'bold'}}>POST</MenuItem>
                </Select>

                <Divider orientation="vertical" flexItem sx={{
                    marginLeft: styles.spaces.medium,
                    marginRight: styles.spaces.medium
                }} />

                <TextField
                    fullWidth
                    value={request?.url}
                    onChange={(e) => onUrlChange(e.currentTarget.value)}
                    variant="standard"
                    sx={{
                        '& .MuiInput-underline:before': {
                            display: 'none',  // Hide the default (inactive) underline
                        },
                        '& .MuiInput-underline:after': {
                            display: 'none',  // Hide the focused (active) underline when the field is blurred
                        },
                        '& .MuiInput-underline.Mui-focused:after': {
                            display: 'block',  // Keep the underline visible when focused
                        },
                    }}
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