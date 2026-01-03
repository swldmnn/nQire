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
            boxSizing: 'border-box',
            bgcolor: 'background.default',
        }}>
            {appContext.appState.openItems.length > 0 && <TabContainer onClose={onClose}>
                {
                    appContext.appState.openItems.map((item, index) => {
                        if (item.typename === 'HttpRequest') {
                            const request = appContext.appState.requestSets
                                .flatMap(set => set.requests)
                                .find(request => request.id === item.id)

                            if (request) {
                                return <TabContentWrapper label={request.label} key={`RequestViewWrapper_${index}_${request.label}`}>
                                    <RequestView
                                        request={request}
                                        key={`RequestView_${index}_${request.label}`}
                                    />
                                </TabContentWrapper>
                            }
                        }

                        if (item.typename === 'Environment') {
                            const environment = appContext.appState.environments
                                .find(environment => environment.id === item.id)

                            if (environment) {
                                return <TabContentWrapper label={environment.label} key={`EnvironmentViewWrapper_${index}_${environment.label}`}>
                                    <EnvironmentView environment={environment} />
                                </TabContentWrapper>
                            }
                        }

                        return null
                    })
                }
            </TabContainer>}
        </Box>)
}

export default TabView