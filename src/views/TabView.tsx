import { Box, Tab, Tabs } from "@mui/material"
import { useTabs } from "../contexts/tabs/useTabs"
import { TabItem } from "../types/types"
import RequestView from "./RequestView"
import EnvironmentView from "./EnvironmentView"
import CloseIcon from '@mui/icons-material/Close'
import { useItems } from "../contexts/items/useItems"
import { ItemsContextType } from "../contexts/items/types"
import ImportView from "./ImportView"
import ExportView from "./ExportView"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    isSelected: boolean;
}

function getTabContent(
    itemsContext: ItemsContextType,
    tabItem: TabItem,
) {
    switch (tabItem.typename) {
        case 'HttpRequest': {
            const request = itemsContext.state.requestSets
                .flatMap(set => set.requests)
                .find(request => request.id === tabItem.id)

            return request ? <RequestView
                request={request}
                key={`RequestView_${request.label}`}
            /> : null

        }
        case 'Environment': {
            return <EnvironmentView
                environmentId={tabItem.id}
                key={`EnvironmentView_${tabItem.label}`}
            />
        }
        case 'ImportItem': {
            return <ImportView />
        }
        case 'ExportItem': {
            return <ExportView />
        }
        default:
            return <Box>Unknown Content</Box>
    }
}

function CustomTabPanel({ children, isSelected, index, ...other }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={!isSelected}
            {...other}
            sx={{
                width: '100%',
                height: '100%',
                minWidth: 0,
                minHeight: 0,
                boxSizing: 'border-box',
            }}
        >
            {children}
        </Box>
    );
}

function TabView() {
    const tabsContext = useTabs()
    const itemsContext = useItems()

    const onChange = (_event: React.SyntheticEvent, newValue: number) => {
        tabsContext.dispatch({ type: 'SELECT_TAB', tabIndex: newValue })
    }

    const onClose = (tabItem: TabItem) => {
        tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: tabItem })
    }

    if (!tabsContext.state.openTabs.length) {
        return null
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    scrollButtons="auto"
                    variant="scrollable"
                    value={tabsContext.state.selectedTabIndex}
                    onChange={onChange}
                >
                    {tabsContext.state.openTabs.map((tabItem, index) =>
                        <Tab
                            label={<div>
                                {tabItem.label}
                                <CloseIcon
                                    onClick={(e) => { e.stopPropagation(); onClose(tabItem) }}
                                    sx={{ height: '1rem', verticalAlign: 'bottom', color: 'secondary.main' }}
                                />
                            </div>}
                            key={`tab_${index}_${tabItem.label}`}
                        ></Tab>
                    )}
                </Tabs>
            </Box>
            <Box sx={{
                flexGrow: 1,
                minWidth: 0,
                minHeight: 0,
            }}>
                {tabsContext.state.openTabs.map((tabItem, index) =>
                    <CustomTabPanel
                        index={index}
                        isSelected={index === tabsContext.state.selectedTabIndex}
                        key={`tabPanel_${index}_${tabItem.label}`}
                    >
                        {getTabContent(itemsContext, tabItem)}
                    </CustomTabPanel>
                )}
            </Box>
        </Box>
    )
}

export default TabView