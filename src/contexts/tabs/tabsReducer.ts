import { TabItem } from "../../types/types"
import { TabsAction, TabsState } from "./types"

const isSameItem = (item1: TabItem, item2: TabItem) => {
    return item1.typename === item2.typename
        && item1.id === item2.id
}

export const tabsReducer = (state: TabsState, action: TabsAction): TabsState => {
    switch (action.type) {
        case 'OPEN_TAB': {
            const openTabs = [...state.openTabs]
            let itemIndex = openTabs.findIndex(tabItem => isSameItem(tabItem, action.tabItem))

            if (itemIndex < 0) {
                openTabs.push(action.tabItem)
                itemIndex = openTabs.length - 1
            }

            return { ...state, openTabs, selectedTabIndex: itemIndex }
        }
        case 'CLOSE_TAB': {
            const openTabs = [...state.openTabs]
            const itemIndex = openTabs.findIndex(tabItem => isSameItem(tabItem, action.tabItem))

            if (itemIndex < 0) {
                return { ...state }
            }

            openTabs.splice(itemIndex, 1)
            const selectedTabIndex = itemIndex < state.selectedTabIndex ? state.selectedTabIndex - 1 : state.selectedTabIndex

            return { ...state, openTabs, selectedTabIndex: Math.max(0, Math.min(selectedTabIndex, openTabs.length - 1)) }
        }
        case 'SELECT_TAB':
            return { ...state, selectedTabIndex: action.tabIndex }
        case 'UPDATE_TAB': {
            const openTabs = [...state.openTabs]
            const tabItem = openTabs.find(tabItem => isSameItem(tabItem, action.tabItem))

            if (tabItem) {
                tabItem.label = action.tabItem.label
            }

            return { ...state, openTabs }
        }
        default:
            return state
    }
}
