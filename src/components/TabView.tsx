import { useContext } from "react"
import TabContainer from "./TabContainer"
import { AppContext } from "../AppContext"
import { Box } from "@mui/material"
import TabContentWrapper from "./TabContentWrapper"
import RequestView from "./RequestView"

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
                        ? <TabContentWrapper label={item.label} key={`RequestViewWrapper_${index}_${item.label}`}><RequestView
                            request={item}
                            key={`RequestView_${index}_${item.label}`}
                        /></TabContentWrapper>
                        : null)
                }
            </TabContainer>}
        </Box>)
}

export default TabView