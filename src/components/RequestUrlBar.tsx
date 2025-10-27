import {TextField, Button, Select, MenuItem}  from "@mui/material";

function RequestUrlBar() {
    return <div className="row">
        <Select name="httpMethod" id="httpMethod" defaultValue={"GET"}>
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
        </Select>

        <TextField id="req-url" fullWidth/>

        <Button variant="contained">Send</Button>
    </div>
}

export default RequestUrlBar