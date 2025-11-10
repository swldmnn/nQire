import { createContext } from 'react';
import { HttpRequestSet } from './components/types';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    appState: AppState
}

export interface AppState {
    openItems: any[]
    requestSets: HttpRequestSet[]
}

export const AppContext = createContext({
    appState: {
        openItems: [],
        requestSets: []
    },
    updateAppState: () => { }
} as AppCtx);