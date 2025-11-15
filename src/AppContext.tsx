import { createContext } from 'react';
import { Environment, HttpRequestSet } from './components/types';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
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
    updateAppState: () => { }
} as AppCtx);