import RequestBody from "./RequestBody";
import RequestUrlBar from "./RequestUrlBar";
import ResponseBody from "./ResponseBody";
import { HttpRequest, HttpRequestResponseProps, HttpResponse } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { THttpRequest, THttpResponse } from "./types_transfer";
import { TabContentProps } from "./TabContainer";
import { useState } from "react";

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

    return <div>
        <RequestUrlBar
            request={request}
            setRequest={setRequest}
            sendRequest={sendRequest}
        />
        <RequestBody
            request={request}
            setRequest={setRequest}
        />
        <br /><br />
        <ResponseBody
            response={response}
            setResponse={setResponse}
        />
    </div>
}

export default RequestView