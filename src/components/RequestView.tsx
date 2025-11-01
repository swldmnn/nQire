import RequestBody from "./RequestBody";
import RequestUrlBar from "./RequestUrlBar";
import ResponseBody from "./ResponseBody";
import { HttpRequest, HttpRequestResponseProps, HttpResponse } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { THttpRequest, THttpResponse } from "./types_transfer";
import { TabContentProps } from "./TabContainer";
import { useState } from "react";
import { Box } from "@mui/material";

interface RequestViewProps extends HttpRequestResponseProps, TabContentProps {
}


function RequestView({ request: inputRequest }: RequestViewProps) {

    const [request, setRequest] = useState(inputRequest)
    const [response, setResponse] = useState({ status: 0, body: undefined } as HttpResponse)

    async function sendRequest(request?: HttpRequest) {
        if (!request || !setResponse) {
            return
        }

        const req = { ...request, body: request.body ?? '' }
        const response = await invoke("send_http_request", { request: req as THttpRequest }) as THttpResponse
        setResponse(response as HttpResponse)
    }

    return <Box sx={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        boxSizing: 'border-box',
    }}>
        <RequestUrlBar
            request={request}
            setRequest={setRequest}
            sendRequest={sendRequest}
        />
        <RequestBody
            request={request}
            setRequest={setRequest}
        />
        {response.status > 0 && <Box sx={{
            paddingTop: '1rem',
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
        }}>
            <ResponseBody
                response={response}
                setResponse={setResponse}
            />
        </Box>}

    </Box>
}

export default RequestView