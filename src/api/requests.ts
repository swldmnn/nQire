import { invoke } from "@tauri-apps/api/core";
import { Environment, HttpRequest, HttpRequestSet, HttpResponse } from "../types/types";
import { HttpHeaderTransfer, HttpRequestSetTransfer, HttpRequestTransfer } from "../types/types_transfer";

export type SaveRequestInput = {
  request: HttpRequestTransfer,
  requestSetId?: number,
}

const sanitizeRequest = (request: HttpRequestTransfer) => {
  const headers = request.headers.filter(header => !!header.key)

  return {
    ...request,
    headers
  } as HttpRequestTransfer
}

const replacePlaceholders = (
  input: string | undefined,
  environment: Environment
) => {
  if (!input) {
    return input
  }

  const envValueMap = environment.values.reduce((acc, value) => {
    acc[value.key] = value.value;
    return acc;
  }, {} as Record<string, string>);

  return input.replace(/{{(.*?)}}/g, (match, placeholderName) => {
    const value = envValueMap[placeholderName]
    return value !== undefined ? value : match
  })
}

const replaceRequestPlaceholders = async (
  request: HttpRequestTransfer,
  environment: Environment
): Promise<HttpRequestTransfer> => {
  return {
    ...request,
    url: replacePlaceholders(request.url, environment) ?? request.url,
    body: replacePlaceholders(request.body, environment),
    headers: request.headers.map(header => {
      return {
        key: replacePlaceholders(header.key, environment) ?? header.key,
        value: replacePlaceholders(header.value, environment) ?? header.value,
      } as HttpHeaderTransfer
    }),
  }
}

export async function sendHttpRequest(request: HttpRequestTransfer, environment?: Environment): Promise<HttpResponse> {
  let sanitizedRequest = sanitizeRequest(request)

  if (environment) {
    sanitizedRequest = await replaceRequestPlaceholders(sanitizedRequest, environment)
  }

  const response = await invoke("send_http_request", { request: sanitizedRequest })
  return response as HttpResponse
}

export async function fetchRequestSets(): Promise<HttpRequestSet[]> {
  const requestSetTransfers: HttpRequestSetTransfer[] = await invoke('find_all_request_sets', {});

  const requestSets: HttpRequestSet[] = requestSetTransfers.map(requestSetTransfer => {
    return {
      id: requestSetTransfer.id,
      label: requestSetTransfer.label,
      requests: requestSetTransfer.requests
        .filter(requestTransfer => !!requestTransfer.id)
        .map(requestTransfer => { return { ...requestTransfer } as HttpRequest })
    } as HttpRequestSet
  })

  return requestSets
}

export async function fetchRequest(requestId: number): Promise<HttpRequest> {
  const requestTransfer: HttpRequestTransfer = await invoke('find_request', { requestId });
  return requestTransfer as HttpRequest
}

export async function saveRequest({ request, requestSetId }: SaveRequestInput): Promise<HttpRequest> {
  const requestTransfer: HttpRequestTransfer = await invoke("save_request", { request, requestSetId })
  return requestTransfer as HttpRequest
}

export async function saveRequestSet(requestSet: HttpRequestSetTransfer): Promise<HttpRequestSet> {
  const requestSetTransfer: HttpRequestSetTransfer = await invoke("save_request_set", { requestSet })

  return {
    id: requestSetTransfer.id,
    label: requestSetTransfer.label,
    requests: requestSetTransfer.requests
      .filter(requestTransfer => !!requestTransfer.id)
      .map(requestTransfer => { return { ...requestTransfer } as HttpRequest })
  } as HttpRequestSet
}

export async function deleteRequest(requestId: number): Promise<void> {
  await invoke("delete_request", { requestId })
}

export async function deleteRequestSet(requestSetId: number) {
  await invoke("delete_request_set", { requestSetId })
}
