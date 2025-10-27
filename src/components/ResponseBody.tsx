import { TextField } from "@mui/material"

function ResponseBody() {
    return <div>
        <TextField
          fullWidth
          id="res-body"
          label="Response"
          multiline
          rows={4}
          defaultValue="<send request to get a response>"
          variant="filled"
        />
    </div>
}

export default ResponseBody