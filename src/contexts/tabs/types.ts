import { TabItem } from "../../types/types"

export type TabsAction =
    | { type: 'OPEN_TAB', tabItem: TabItem }
    | { type: 'CLOSE_TAB', tabItem: TabItem }
    | { type: 'SELECT_TAB', tabIndex: number }
    | { type: 'UPDATE_TAB', tabItem: TabItem }

export interface TabsState {
    openTabs: TabItem[]
    selectedTabIndex: number
}

export interface TabsContextType {
    state: TabsState
    dispatch: React.Dispatch<TabsAction>
}