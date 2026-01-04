
import { useContext } from 'react'
import { ItemsContext } from './ItemsContext'

export const useItems = () => {
    const context = useContext(ItemsContext)
    if (!context) {
        throw new Error('useItems must be used within a ItemsProvider')
    }
    return context
}