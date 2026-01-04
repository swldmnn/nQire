import { createContext } from 'react';
import { TabItem, Environment, HttpRequestSet } from './types/types';
import { ErrorTransfer } from './types/types_transfer';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    saveItem: (item: TabItem) => Promise<boolean | ErrorTransfer>
    initialize: () => void
    appState: AppState
}

export interface AppState {
    initialized: boolean
    requestSets: HttpRequestSet[]
    environments: Environment[]
}

export const AppContext = createContext({
    appState: {
        initialized: false,
        requestSets: [],
        environments: [],
    },
    updateAppState: () => { },
    saveItem: async () => false,
    initialize: () => { },
} as AppCtx);