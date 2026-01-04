import { createContext } from 'react';
import { DisplayItem, Environment, HttpRequestSet } from './types/types';
import { ErrorTransfer } from './types/types_transfer';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    openItem: (item: DisplayItem) => void
    saveItem: (item: DisplayItem) => Promise<boolean | ErrorTransfer>
    initialize: () => void
    appState: AppState
}

export interface AppState {
    openItems: DisplayItem[]
    selectedTabIndex: number
    initialized: boolean
    requestSets: HttpRequestSet[]
    environments: Environment[]
}

export const AppContext = createContext({
    appState: {
        openItems: [],
        selectedTabIndex: 0,
        initialized: false,
        requestSets: [],
        environments: [],
    },
    updateAppState: () => { },
    openItem: () => { },
    saveItem: async () => false,
    initialize: () => { },
} as AppCtx);