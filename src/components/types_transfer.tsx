/**
 * Types that are transferred to/from tauri backend.
 * Keep in sync with the corresponding backend types to avoid Serialization Errors.
 */

export interface HttpRequestSetTransfer {
    name: string
    requests: HttpRequestTransfer[]
}

export interface HttpRequestTransfer {
    label: string
    method: string
    url: string
    headers: HttpHeaderTransfer[]
    body?: string
}

export interface HttpResponseTransfer {
    status: number
    body: string
}

export interface HttpHeaderTransfer {
    key: string
    value: string
}