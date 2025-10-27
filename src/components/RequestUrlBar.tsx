import {TextField, Button, Select, MenuItem}  from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

function RequestUrlBar() {

    async function sendRequest(url: string) {
        const response = await invoke("send_http_request", { url })
        console.log(response)
    }

    return <div className="row">
        <Select name="httpMethod" id="httpMethod" defaultValue={"GET"}>
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
        </Select>

        <TextField id="req-url" fullWidth value={"https://api.chucknorris.io/jokes/random"}/>

        <Button variant="contained" onClick={() => sendRequest("foo")}>Send</Button>
    </div>
}

export default RequestUrlBar