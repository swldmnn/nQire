import { Box, Divider, Tab, Tabs, Typography } from "@mui/material"
import { useTabs } from "../contexts/tabs/useTabs"
import { TabItem } from "../types/types"
import RequestView from "./RequestView"
import EnvironmentView from "./EnvironmentView"
import ImportView from "./ImportView"
import ExportView from "./ExportView"
import TabHeader from "../components/TabHeader"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    isSelected: boolean;
}

function getTabContent(
    tabItem: TabItem,
) {
    switch (tabItem.typename) {
        case 'HttpRequest': {
            return <RequestView
                requestId={tabItem.id}
                key={`RequestView_${tabItem.label}`}
            />

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
                            key={`tab_${index}_${tabItem.label}`}
                            label={<TabHeader label={tabItem.label} onClose={() => onClose(tabItem)} />}
                            sx={{
                                minWidth: 0,
                                textTransform: 'none',
                                padding: 0,
                            }}
                        />
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
                        {getTabContent(tabItem)}
                    </CustomTabPanel>
                )}
            </Box>
        </Box>
    )
}

export default TabView