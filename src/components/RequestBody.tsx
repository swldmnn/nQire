import { TextField } from "@mui/material"
import { HttpRequestResponseProps } from "../types/types"

interface RequestBodyProps extends HttpRequestResponseProps {
}

function RequestBody({ request, updateRequest, syncRequest }: RequestBodyProps) {
    if (!request) {
        return null
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (updateRequest) {
            updateRequest({ ...request, body: e.currentTarget.value })
        }
    }

    const onBlur = () => {
        if (syncRequest) {
            syncRequest(request)
        }
    }

    return <div className="row">
        <TextField
            fullWidth
            id="req-body"
            multiline
            value={request.body ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            slotProps={{
                htmlInput: {
                    autoCorrect: 'off',
                    autoCapitalize: 'off',
                    spellCheck: false,
                    inputMode: 'text',
                },
            }}
        />
    </div>
}

export default RequestBody