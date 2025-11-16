import { TextField } from "@mui/material"
import { HttpRequestResponseProps } from "../types/types"

interface RequestBodyProps extends HttpRequestResponseProps {
}

function RequestBody({ request, setRequest }: RequestBodyProps) {
    if (!request || !setRequest) {
        return null
    }

    const onBodyChange = (newValue: string) => {
        setRequest({ ...request, body: newValue })
    }

    return <div className="row">
        <TextField
            fullWidth
            id="req-body"
            multiline
            rows={4}
            value={request?.body ?? ''}
            variant="filled"
            onChange={(e) => onBodyChange(e.currentTarget.value)}
        />
    </div>
}

export default RequestBody