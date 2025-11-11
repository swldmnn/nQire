
interface TabItem {
    typename: string
    id: number
    label: string
}

export interface HttpRequestResponseProps {
    request?: HttpRequest
    response?: HttpResponse
    setRequest?: (request: HttpRequest) => void
    setResponse?: (response: HttpResponse) => void
}

export interface HttpRequestSet {
    name: string
    requests: HttpRequest[]
}

export interface HttpRequest extends TabItem {
    typename: 'HttpRequest'
    method: string
    url: string
    headers: HttpHeader[]
    body?: string
}

export interface HttpResponse {
    status: number
    body?: string
}

export interface HttpHeader {
    key: string
    value: string
}