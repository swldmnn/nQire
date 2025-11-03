/**
 * Types that are transferred to/from tauri backend.
 * Keep in sync with the corresponding backend types to avoid Serialization Errors.
 */

export interface THttpRequest {
    method: string
    url: string
    headers: THttpHeader[]
    body?: string
}

export interface THttpResponse {
    status: number
    body: string
}

export interface THttpHeader {
    key: string
    value: string
}