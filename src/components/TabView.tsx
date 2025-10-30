import { useContext } from "react"
import RequestView from "./RequestView"
import TabContainer from "./TabContainer"
import { AppContext } from "../AppContext"

function TabView() {
    const appContext = useContext(AppContext)

    const onClose = (index: number) => {
        appContext.appState.openItems.splice(index, 1)
        appContext.updateAppState(appContext.appState)
    }

    return (appContext.appState.openItems.length > 0 && <TabContainer onClose={onClose}>
        {
            appContext.appState.openItems.map((item, index) => item.typename === 'HttpRequest'
                ? <RequestView
                    request={item}
                    label={item.label}
                    key={`RequestView_${index}_${item.label}`}
                />
                : null)
        }
    </TabContainer>)
}

export default TabView