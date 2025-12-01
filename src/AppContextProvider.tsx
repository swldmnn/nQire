import { useState } from "react"
import { AppContext, AppCtx, AppState } from "./AppContext"
import { DisplayItem, Environment, HttpRequestSet } from "./types/types";
import { EnvironmentTransfer, ErrorTransfer, HttpRequestSetTransfer, HttpRequestTransfer } from "./types/types_transfer";
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
        if (item.typename === 'HttpRequest') {
            const result: number | ErrorTransfer = await invoke("save_request", { request: item as HttpRequestTransfer })

            if (typeof result === "number") {
                console.log('saved successfully')
                await initialize()
                return true
            }

            return false
        }

        //TODO handle other types

        return false
    }

    const initialContext = {
        appState: {
            openItems: [],
            selectedTabIndex: 0,
            initialized: false,
            requestSets: [],
            environments: [],
        },
        updateAppState,
        openItem,
        saveItem,
        initialize,
    } as AppCtx

    const [appContext, setAppContext] = useState(initialContext)

    return <AppContext.Provider value={appContext}>
        {props.children}
    </AppContext.Provider>
}

export default AppContextProvider
