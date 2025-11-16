import { useContext } from "react"
import TabContainer from "../components/TabContainer"
import { AppContext } from "../AppContext"
import { Box } from "@mui/material"
import TabContentWrapper from "../components/TabContentWrapper"
import RequestView from "./RequestView"
import EnvironmentView from "../views/EnvironmentView"

function TabView() {
    const appContext = useContext(AppContext)

    const onClose = (index: number) => {
        appContext.appState.openItems.splice(index, 1)

        const selectedTabIndex = appContext.appState.selectedTabIndex
        if (index <= selectedTabIndex) {
            appContext.appState.selectedTabIndex = Math.max(0, selectedTabIndex - 1)
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