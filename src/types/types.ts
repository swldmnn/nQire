
export interface DisplayItem {
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

export interface HttpRequestSet extends DisplayItem {
    typename: 'HttpRequestSet'
    requests: HttpRequest[]
}

export interface HttpRequest extends DisplayItem {
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

export interface Environment extends DisplayItem {
    typename: 'Environment'
    values: EnvironmentValue[]
}

export interface EnvironmentValue {
    key: string
    value: string
}

export interface Action {
    label: string,
    callback: () => void
}