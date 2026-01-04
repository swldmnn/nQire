import { useState } from "react"
import { AppContext, AppCtx, AppState } from "./AppContext"
import { DisplayItem, Environment, HttpRequest, HttpRequestSet } from "./types/types";
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
        const loadedRequestSets: HttpRequestSet[] = loadedRequestSetTransfers.map(requestSetTransfer => {
            return {
                id: requestSetTransfer.id,
                label: requestSetTransfer.label,
                requests: requestSetTransfer.requests
                    .filter(requestTransfer => !!requestTransfer.id)
                    .map(requestTransfer => { return { ...requestTransfer } as HttpRequest })
            } as HttpRequestSet
        })

        appContext.appState.requestSets = loadedRequestSets
        appContext.updateAppState(appContext.appState)
    };

    const getEnvironments = async () => {
        const loadedEnvironmentTransfers: EnvironmentTransfer[] = await invoke('find_all_environments', {});
        const loadedEnvironments: Environment[] = loadedEnvironmentTransfers
            .filter(environmentTransfer => !!environmentTransfer.id)
            .map(environmentTransfer => { return { ...environmentTransfer } as Environment })

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

            return isError(result) ? result : false
        } catch (error) {
            return isError(error) ? error : false
        }
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
