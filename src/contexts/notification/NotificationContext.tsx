import { createContext } from 'react'
import { NotificationContextType } from './types'
import React, { useReducer } from 'react'
import { NotificationState } from './types'
import { notificationReducer } from './notificationReducer'

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const initialState: NotificationState = {
    showNotification: false,
    notification: {
      type: 'info',
      message: '',
      closeAfterMillis: 5000,
    },
  }

  const [state, dispatch] = useReducer(notificationReducer, initialState)

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}