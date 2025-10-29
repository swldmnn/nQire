import RequestBody from "./RequestBody";
import RequestUrlBar from "./RequestUrlBar";
import ResponseBody from "./ResponseBody";
import { HttpRequest, HttpRequestResponseProps, HttpResponse } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { THttpRequest, THttpResponse } from "./types_transfer";

interface RequestViewProps extends HttpRequestResponseProps {
}


function RequestView({ request, setRequest, response, setResponse }: RequestViewProps) {
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