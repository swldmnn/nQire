import { createContext } from 'react'
import { TabsContextType, TabsState } from './types'
import React, { useReducer } from 'react'
import { tabsReducer } from './tabsReducer'
import { NO_TAB_INDEX } from '../../constants';

interface TabsProviderProps {
  children: React.ReactNode;
}

export const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
  const initialState: TabsState = {
    selectedTabIndex: NO_TAB_INDEX,
    openTabs: [],
  }

  const [state, dispatch] = useReducer(tabsReducer, initialState)

  return (
    <TabsContext.Provider value={{ state, dispatch }}>
      {children}
    </TabsContext.Provider>
  )
}