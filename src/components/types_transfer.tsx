/**
 * Types that are transferred to/from tauri backend.
 * Keep in sync with the corresponding backend types to avoid Serialization Errors.
 */

export interface THttpRequest {
    method: string
    url: string
    body?: string
}

export interface THttpResponse {
    status: number
    body: string
}