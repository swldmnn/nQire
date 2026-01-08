import { invoke } from "@tauri-apps/api/core";
import { HttpRequest, HttpRequestSet } from "../types/types";
import { HttpRequestSetTransfer } from "../types/types_transfer";

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