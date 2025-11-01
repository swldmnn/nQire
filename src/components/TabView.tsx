import { useContext } from "react"
import RequestView from "./RequestView"
import TabContainer from "./TabContainer"
import { AppContext } from "../AppContext"
import { Box } from "@mui/material"

function TabView() {
    const appContext = useContext(AppContext)

    const onClose = (index: number) => {
        appContext.appState.openItems.splice(index, 1)
        appContext.updateAppState(appContext.appState)
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
            boxSizing: 'border-box'
        }}>
            {appContext.appState.openItems.length > 0 && <TabContainer onClose={onClose}>
                {
                    appContext.appState.openItems.map((item, index) => item.typename === 'HttpRequest'
                        ? <RequestView
                            request={item}
                            label={item.label}
                            key={`RequestView_${index}_${item.label}`}
                        />
                        : null)
                }
            </TabContainer>}
        </Box>)
}

export default TabView