import { createContext } from 'react';
import { DisplayItem, Environment, HttpRequestSet } from './types/types';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    openItem: (item: DisplayItem) => void
    appState: AppState
}

export interface AppState {
    openItems: any[]
    selectedTabIndex: number
    requestSets: HttpRequestSet[]
    environments: Environment[]
}

export const AppContext = createContext({
    appState: {
        openItems: [],
        selectedTabIndex: 0,
        requestSets: [],
        environments: [],
    },
    updateAppState: () => { },
    openItem: () => { }
} as AppCtx);