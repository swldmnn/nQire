import { useState } from "react"
import { AppContext, AppCtx, AppState } from "./AppContext"

interface AppContextProviderProps {
    children?: React.ReactNode;
}

function AppContextProvider(props: AppContextProviderProps) {
    const updateAppState = (appState: AppState) => {
        setAppContext({ ...appContext, appState })
    }

    const initialContext = {
        appState: {
            openItems: [],
            selectedTabIndex: 0,
            requestSets: [],
            environments: [],
        },
        updateAppState
    } as AppCtx

    const [appContext, setAppContext] = useState(initialContext)

    return <AppContext.Provider value={appContext}>
        {props.children}
    </AppContext.Provider>
}

export default AppContextProvider
