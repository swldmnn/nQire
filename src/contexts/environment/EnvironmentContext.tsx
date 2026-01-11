import { createContext } from 'react'
import { EnvironmentContextType, EnvironmentState } from './types'
import React, { useReducer } from 'react'
import { environmentReducer } from './environmentReducer'
import { NO_ENVIRONMENT_ID } from '../../constants';

interface EnvironmentProviderProps {
  children: React.ReactNode;
}

export const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined)

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({ children }) => {
  const initialState: EnvironmentState = {
    activeEnvironmentId: NO_ENVIRONMENT_ID,
  };

  const [state, dispatch] = useReducer(environmentReducer, initialState);

  return (
    <EnvironmentContext.Provider value={{ state, dispatch }}>
      {children}
    </EnvironmentContext.Provider>
  )
}