import { TextField } from "@mui/material"

function ResponseBody() {
    return <div>
        <TextField
          fullWidth
          id="res-body"
          label="Response"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="filled"
        />
    </div>
}

export default ResponseBody