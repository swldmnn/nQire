/**
 * Types that are transferred to/from tauri backend.
 * Keep in sync with the corresponding backend types to avoid Serialization Errors.
 */

export interface HttpRequestSetTransfer {
    typename: 'HttpRequestSet'
    id: number
    label: string
    requests: HttpRequestTransfer[]
}

export interface ErrorTransfer {
    typename: 'Error'
    errorMessage: string
}

export function isError(error: any): error is ErrorTransfer {
    return error.typename === 'Error';
}

export interface HttpRequestTransfer {
    typename: 'HttpRequest'
    id?: number
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

export interface EnvironmentTransfer {
    typename: 'Environment'
    id?: number
    label: string
    values: EnvironmentValueTransfer[]
}

export interface EnvironmentValueTransfer {
    key: string
    value: string
}