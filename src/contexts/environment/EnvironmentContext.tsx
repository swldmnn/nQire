import { createContext } from 'react';
import { EnvironmentContextType, EnvironmentState } from './types';
import React, { useReducer } from 'react';
import { environmentReducer } from './environmentReducer';

interface EnvironmentProviderProps {
  children: React.ReactNode;
}

export const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({ children }) => {
  const initialState: EnvironmentState = {
    activeEnvironmentId: -1,
  };

  const [state, dispatch] = useReducer(environmentReducer, initialState);

  return (
    <EnvironmentContext.Provider value={{ state, dispatch }}>
      {children}
    </EnvironmentContext.Provider>
  );
};