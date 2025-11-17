import { useState } from "react"
import { AppContext, AppCtx, AppState } from "./AppContext"
import { DisplayItem } from "./types/types";

interface AppContextProviderProps {
    children?: React.ReactNode;
}

function AppContextProvider(props: AppContextProviderProps) {
    const updateAppState = (appState: AppState) => {
        setAppContext({ ...appContext, appState })
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

    const initialContext = {
        appState: {
            openItems: [],
            selectedTabIndex: 0,
            requestSets: [],
            environments: [],
        },
        updateAppState,
        openItem
    } as AppCtx

    const [appContext, setAppContext] = useState(initialContext)

    return <AppContext.Provider value={appContext}>
        {props.children}
    </AppContext.Provider>
}

export default AppContextProvider
