
export interface HttpRequestResponseProps {
    request?: HttpRequest
    response?: HttpResponse
    setRequest?: (request: HttpRequest) => void
    setResponse?: (response: HttpResponse) => void
}

export interface HttpRequest {
    label: string
    method: string
    url: string
    body?: string
}

export interface HttpResponse {
    status: number
    body?: string
}