import { createContext } from 'react';
import { DisplayItem, Environment, HttpRequestSet } from './types/types';

export interface AppCtx {
    updateAppState: (appState: AppState) => void
    openItem: (item: DisplayItem) => void
    saveItem: (item: DisplayItem) => Promise<boolean|string>
    initialize: () => void
    showNotification: (notification: NotificationState) => void
    hideNotification: () => void
    appState: AppState
}

export interface NotificationState {
    open: boolean
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    closeAfterMillis: 5000
}

export interface AppState {
    openItems: DisplayItem[]
    selectedTabIndex: number
    initialized: boolean
    requestSets: HttpRequestSet[]
    environments: Environment[]
    activeEnvironment: string
    notification: NotificationState
}

export const AppContext = createContext({
    appState: {
        openItems: [],
        selectedTabIndex: 0,
        initialized: false,
        requestSets: [],
        environments: [],
        activeEnvironment: 'none',
        notification: {
            open: false,
            message: '',
            type: 'info',
            closeAfterMillis: 5000,
        }
    },
    updateAppState: () => { },
    openItem: () => { },
    saveItem: async () => false,
    initialize: () => { },
    showNotification: () => { },
    hideNotification: () => { },
} as AppCtx);