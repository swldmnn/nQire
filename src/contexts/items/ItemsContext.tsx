import { createContext } from 'react'
import { ItemsContextType, ItemsState } from './types'
import React, { useReducer } from 'react'
import { itemsReducer } from './itemsReducer'
import { EnvironmentTransfer, ErrorTransfer, HttpRequestSetTransfer, HttpRequestTransfer, isError } from '../../types/types_transfer'
import { Environment, HttpRequest, HttpRequestSet, TabItem } from '../../types/types'
import { invoke } from '@tauri-apps/api/core'

interface ItemsProviderProps {
  children: React.ReactNode
}

const getRequestSets = async () => {
  const loadedRequestSetTransfers: HttpRequestSetTransfer[] = await invoke('find_all_request_sets', {});
  const loadedRequestSets: HttpRequestSet[] = loadedRequestSetTransfers.map(requestSetTransfer => {
    return {
      id: requestSetTransfer.id,
      label: requestSetTransfer.label,
      requests: requestSetTransfer.requests
        .filter(requestTransfer => !!requestTransfer.id)
        .map(requestTransfer => { return { ...requestTransfer } as HttpRequest })
    } as HttpRequestSet
  })

  return loadedRequestSets
};

const getEnvironments = async () => {
  const loadedEnvironmentTransfers: EnvironmentTransfer[] = await invoke('find_all_environments', {});
  const loadedEnvironments: Environment[] = loadedEnvironmentTransfers
    .filter(environmentTransfer => !!environmentTransfer.id)
    .map(environmentTransfer => { return { ...environmentTransfer } as Environment })

  return loadedEnvironments
};

const saveItem = async (item: TabItem) => {
  let result: number | ErrorTransfer | undefined = undefined

  try {
    if (item.typename === 'HttpRequest') {
      result = await invoke("save_request", { request: item as HttpRequestTransfer })
    }
    if (item.typename === 'Environment') {
      result = await invoke("save_environment", { environment: item as EnvironmentTransfer })
    }

    if (typeof result === "number") {
      return true
    }

    return isError(result) ? result : false
  } catch (error) {
    return isError(error) ? error : false
  }
}

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const initialState: ItemsState = {
    initialized: false,
    requestSets: [],
    environments: [],
    loadItems: async () => { return { requestSets: await getRequestSets(), environments: await getEnvironments() } },
    saveItem,
  }

  const [state, dispatch] = useReducer(itemsReducer, initialState)

  return (
    <ItemsContext.Provider value={{ state, dispatch }}>
      {children}
    </ItemsContext.Provider>
  )
}