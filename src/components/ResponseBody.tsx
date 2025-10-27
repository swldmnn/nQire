import { TextField } from "@mui/material"
import { HttpRequestResponseProps } from "./types"

interface ResponseBodyProps extends HttpRequestResponseProps{
}

function ResponseBody({response}: ResponseBodyProps) {
    return <div>
        <TextField
          fullWidth
          id="res-body"
          label="Response"
          multiline
          rows={4}
          value={response?.body}
          variant="filled"
        />
    </div>
}

export default ResponseBody