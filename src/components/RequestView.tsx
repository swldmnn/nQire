import { useState } from "react";
import RequestBody from "./RequestBody";
import RequestUrlBar from "./RequestUrlBar";
import ResponseBody from "./ResponseBody";
import { HttpRequest, HttpResponse } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { THttpRequest, THttpResponse } from "./types_transfer";


function RequestView() {
    const [request, setRequest] = useState({method: "GET", url: "https://api.chucknorris.io/jokes/random", body: "{reqBody}"} as HttpRequest)
    const [response, setResponse] = useState({status: 0, body: "{resBody}"} as HttpResponse)

    async function sendRequest(request?: HttpRequest) {
        if(!request) {
            return
        }

        const response = await invoke("send_http_request", { request: request as THttpRequest }) as THttpResponse
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