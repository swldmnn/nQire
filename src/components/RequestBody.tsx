import { TextField } from "@mui/material"
import { HttpRequestResponseProps } from "./types"

interface RequestBodyProps extends HttpRequestResponseProps{
}

function RequestBody({request, setRequest}: RequestBodyProps) {
    return <div className="row">
        <TextField
          fullWidth
          id="req-body"
          label="Body"
          multiline
          rows={4}
          value={request?.body}
          variant="filled"
          onChange={(e) => {
                if(request && setRequest) {
                    setRequest({...request, body: e.target.value })    
                }
                }}
        />
    </div>
}

export default RequestBody