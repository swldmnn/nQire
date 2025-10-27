import {TextField, Button, Select, MenuItem}  from "@mui/material";
import { HttpRequest, HttpRequestResponseProps } from "./types";

interface RequestUrlBarProps extends HttpRequestResponseProps{
    sendRequest: (request?: HttpRequest) => void
}

function RequestUrlBar({request, setRequest, sendRequest}: RequestUrlBarProps) {
    return <div className="row">
        <Select 
            name="httpMethod" 
            value={request?.method}
            onChange={(e) => {
                if(request && setRequest) {
                    setRequest({...request, method: e.target.value })    
                }
                }}
        >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
        </Select>

        <TextField 
            fullWidth 
            value={request?.url}
            onChange={(e) => {
                if(request && setRequest) {
                    setRequest({...request, url: e.currentTarget.value})
                }
            }}
        />

        <Button variant="contained" onClick={() => {sendRequest(request)}}>Send</Button>
    </div>
}

export default RequestUrlBar