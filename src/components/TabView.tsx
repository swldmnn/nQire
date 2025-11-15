import { useContext } from "react"
import TabContainer from "./TabContainer"
import { AppContext } from "../AppContext"
import { Box } from "@mui/material"
import TabContentWrapper from "./TabContentWrapper"
import RequestView from "./RequestView"
import EnvironmentView from "./EnvironmentView"

function TabView() {
    const appContext = useContext(AppContext)

    const onClose = (index: number) => {
        appContext.appState.openItems.splice(index, 1)
        if (index <= appContext.appState.selectedTabIndex) {
            appContext.appState.selectedTabIndex -= 1
        }
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
                    appContext.appState.openItems.map((item, index) => {
                        if (item.typename === 'HttpRequest') {
                            return <TabContentWrapper label={item.label} key={`RequestViewWrapper_${index}_${item.label}`}>
                                <RequestView
                                    request={item}
                                    key={`RequestView_${index}_${item.label}`}
                                />
                            </TabContentWrapper>
                        }

                        if (item.typename === 'Environment') {
                            return <TabContentWrapper label={item.label} key={`EnvironmentViewWrapper_${index}_${item.label}`}>
                                <EnvironmentView environment={item} />
                            </TabContentWrapper>
                        }

                        return null
                    })
                }
            </TabContainer>}
        </Box>)
}

export default TabView