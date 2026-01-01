import { useState } from "react"
import { AppContext, AppCtx, AppState, NotificationState } from "./AppContext"
import { DisplayItem, Environment, HttpRequestSet } from "./types/types";
import { EnvironmentTransfer, ErrorTransfer, HttpRequestSetTransfer, HttpRequestTransfer, isError } from "./types/types_transfer";
import { invoke } from "@tauri-apps/api/core";

interface AppContextProviderProps {
    children?: React.ReactNode;
}

function AppContextProvider(props: AppContextProviderProps) {
    const updateAppState = (appState: AppState) => {
        setAppContext({ ...appContext, appState })
    }

    const getRequestSets = async () => {
        const loadedRequestSetTransfers: HttpRequestSetTransfer[] = await invoke('find_all_request_sets', {});
        const loadedRequestSets: HttpRequestSet[] = loadedRequestSetTransfers

        appContext.appState.requestSets = loadedRequestSets
        appContext.updateAppState(appContext.appState)
    };

    const getEnvironments = async () => {
        const loadedEnvironmentTransfers: EnvironmentTransfer[] = await invoke('find_all_environments', {});
        const loadedEnvironments: Environment[] = loadedEnvironmentTransfers
            .filter(env => !!env.id)
            .map(env => { return { ...env } as Environment })

        appContext.appState.environments = loadedEnvironments
        appContext.updateAppState(appContext.appState)
    };

    const initialize = async () => {
        await getRequestSets()
        await getEnvironments()

        appContext.appState.initialized = true
        appContext.updateAppState(appContext.appState)
    }

    const openItem = (item: DisplayItem) => {
        const openItemIndex = appContext.appState.openItems.findIndex(openItem =>
            openItem.typename === item.typename && openItem.id === item.id
        )

        if (openItemIndex >= 0) {
            appContext.appState.selectedTabIndex = openItemIndex
        } else {
            appContext.appState.openItems.push(item)
            appContext.appState.selectedTabIndex = appContext.appState.openItems.length - 1
        }

        updateAppState(appContext.appState)
    }

    const saveItem = async (item: DisplayItem) => {
        let result: number | ErrorTransfer | undefined = undefined

        try {
            if (item.typename === 'HttpRequest') {
                result = await invoke("save_request", { request: item as HttpRequestTransfer })
            }
            if (item.typename === 'Environment') {
                result = await invoke("save_environment", { environment: item as EnvironmentTransfer })
            }

            if (typeof result === "number") {
                await initialize()
                openItem(item)
                return true
            }

            return false
        } catch (error) {
            if (isError(error)) {
                return error.errorMessage
            }
            return false
        }
    }

    const showNotification = (notification: NotificationState) => {
        appContext.appState.notification = notification
        appContext.updateAppState(appContext.appState)
    }

    const hideNotification = () => {
        appContext.appState.notification = { ...appContext.appState.notification, open: false }
        appContext.updateAppState(appContext.appState)
    }

    const initialContext = {
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
        updateAppState,
        openItem,
        saveItem,
        initialize,
        showNotification,
        hideNotification,
    } as AppCtx

    const [appContext, setAppContext] = useState(initialContext)

    return <AppContext.Provider value={appContext}>
        {props.children}
    </AppContext.Provider>
}

export default AppContextProvider
