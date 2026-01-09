import { invoke } from "@tauri-apps/api/core";
import { HttpRequest, HttpRequestSet, HttpResponse } from "../types/types";
import { HttpRequestSetTransfer, HttpRequestTransfer } from "../types/types_transfer";

export type SaveRequestInput = {
  request: HttpRequestTransfer,
  requestSetId?: number,
}

const sanitizeRequest = (request: HttpRequestTransfer) => {
  const headers = request.headers.filter(header => !!header.key)

  return {
    ... request,
    headers
  } as HttpRequestTransfer
}

export async function sendHttpRequest(request: HttpRequestTransfer): Promise<HttpResponse> {
  const response = await invoke("send_http_request", { request: sanitizeRequest(request) })
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
  console.log
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