import { createContext } from 'react';
import { Environment, HttpRequestSet } from './components/types';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    appState: AppState
}

export interface AppState {
    openItems: any[]
    requestSets: HttpRequestSet[]
    environments: Environment[]
}

export const AppContext = createContext({
    appState: {
        openItems: [],
        requestSets: [],
        environments: [],
    },
    updateAppState: () => { }
} as AppCtx);