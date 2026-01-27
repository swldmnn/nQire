import { EnvironmentTransfer, HttpRequestSetTransfer, HttpRequestTransfer } from "./types_transfer"

export interface TabItem {
    typename: string
    id: number
    label: string
}

export interface HttpRequestResponseProps {
    request?: HttpRequest
    response?: HttpResponse
    updateRequest?: (request: HttpRequest) => void
    syncRequest?: (request: HttpRequest) => void
    updateResponse?: (response: HttpResponse) => void
}

export interface HttpRequestSet extends TabItem {
    typename: 'HttpRequestSet'
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

export interface Environment extends TabItem {
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

export interface ImportItem {
    selected: boolean,
    item: HttpRequestTransfer | HttpRequestSetTransfer | EnvironmentTransfer,
}
