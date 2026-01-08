import { invoke } from "@tauri-apps/api/core";
import { Environment } from "../types/types";
import { EnvironmentTransfer } from "../types/types_transfer";

export async function fetchEnvironments(): Promise<Environment[]> {
  const environmentTransfers: EnvironmentTransfer[] = await invoke('find_all_environments', {});

  return environmentTransfers
    .filter(environmentTransfer => !!environmentTransfer.id)
    .map(environmentTransfer => { return { ...environmentTransfer } as Environment })
}

export async function fetchEnvironment(environmentId: number): Promise<Environment> {
  const environmentTransfer: EnvironmentTransfer = await invoke('find_environment', { environmentId });
  return environmentTransfer as Environment
}

export async function saveEnvironment(environment: EnvironmentTransfer): Promise<Environment> {
  const result = await invoke("save_environment", { environment })
  return result as Environment
}

export async function deleteEnvironment(environmentId: number): Promise<void> {
  await invoke("delete_environment", { environmentId })
}