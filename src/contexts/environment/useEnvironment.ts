
import { useContext } from 'react'
import { EnvironmentContext } from './EnvironmentContext'

export const useEnvironment = () => {
    const context = useContext(EnvironmentContext)
    if (!context) {
        throw new Error('useEnvironment must be used within a EnvironmentProvider')
    }
    return context
};