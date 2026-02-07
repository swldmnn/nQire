import { TextField, Button, Select, MenuItem, Box, Divider, Paper, useColorScheme } from "@mui/material";
import { assertHttpMethod, HttpMethod, HttpRequest, HttpRequestResponseProps } from "../types/types";
import { styles } from "../constants";

interface RequestUrlBarProps extends HttpRequestResponseProps {
    sendRequest: (request?: HttpRequest) => void
}

function RequestUrlBar({ request, updateRequest, sendRequest, syncRequest }: RequestUrlBarProps) {
    if (!request) {
        return null
    }

    const { mode } = useColorScheme();
    const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

    const onMethodChange = (newValue: string) => {
        if (updateRequest) {
            assertHttpMethod(newValue);
            updateRequest({ ...request, method: newValue })
        }
    }

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (updateRequest) {
            updateRequest({ ...request, url: e.currentTarget.value })
        }
    }

    const onBlur = () => {
        if (syncRequest) {
            syncRequest(request)
        }
    }

    return <Box>
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
                    onBlur={onBlur}
                    variant="standard"
                    className={`http-${request.method.toLowerCase()} ${themeClass}`}
                    disableUnderline
                    sx={{ fontWeight: 'bold' }}
                >
                    <MenuItem value={'GET' as HttpMethod} className={`http-get ${themeClass}`} sx={{ fontWeight: 'bold' }}>GET</MenuItem>
                    <MenuItem value={'POST' as HttpMethod} className={`http-post ${themeClass}`} sx={{ fontWeight: 'bold' }}>POST</MenuItem>
                    <MenuItem value={'PATCH' as HttpMethod} className={`http-patch ${themeClass}`} sx={{ fontWeight: 'bold' }}>PATCH</MenuItem>
                    <MenuItem value={'PUT' as HttpMethod} className={`http-put ${themeClass}`} sx={{ fontWeight: 'bold' }}>PUT</MenuItem>
                    <MenuItem value={'DELETE' as HttpMethod} className={`http-delete ${themeClass}`} sx={{ fontWeight: 'bold' }}>DELETE</MenuItem>
                </Select>

                <Divider orientation="vertical" flexItem sx={{
                    marginLeft: styles.spaces.medium,
                    marginRight: styles.spaces.medium
                }} />

                <TextField
                    fullWidth
                    value={request?.url}
                    onChange={onUrlChange}
                    onBlur={onBlur}
                    variant="standard"
                    sx={{
                        '& .MuiInput-underline:before': {
                            display: 'none',
                        },
                        '& .MuiInput-underline:after': {
                            display: 'none',
                        },
                        '& .MuiInput-underline.Mui-focused:after': {
                            display: 'block'
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