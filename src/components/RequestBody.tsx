import { TextField } from "@mui/material"

function RequestBody() {
    return <div className="row">
        <TextField
          fullWidth
          id="req-body"
          label="Body"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="filled"
        />
    </div>
}

export default RequestBody