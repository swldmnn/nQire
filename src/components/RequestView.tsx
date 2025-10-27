import { useState } from "react";
import RequestBody from "./RequestBody";
import RequestUrlBar from "./RequestUrlBar";
import ResponseBody from "./ResponseBody";
import { HttpRequest, HttpResponse } from "./types";
import { invoke } from "@tauri-apps/api/core";


function RequestView() {
    const [request, setRequest] = useState({method: "GET", url: "https://api.chucknorris.io/jokes/random", body: "{reqBody}"} as HttpRequest)
    const [response, setResponse] = useState({status: 0, body: "{resBody}"} as HttpResponse)

    async function sendRequest(request?: HttpRequest) {
        if(!request) {
            return
        }
        const  {url: reqUrl, method} = request
        const url = `[${method}] ${reqUrl}`

        const response = await invoke("send_http_request", { url })
        setResponse({status: 200, body: `${response}`})
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