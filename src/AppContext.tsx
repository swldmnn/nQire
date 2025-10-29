import { createContext } from 'react';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    appState: AppState
}

export interface AppState {
    openItems: any[]
}

export const AppContext = createContext({ appState: { openItems: [] }, updateAppState: () => { } } as AppCtx);