
import { Environment, HttpRequestSet, TabItem } from "../../types/types"
import { ErrorTransfer } from "../../types/types_transfer"

export type ItemsAction =
    | { type: 'UPDATE_ITEMS', requestSets: HttpRequestSet[], environments: Environment[] }

export interface ItemsState {
    initialized: boolean
    requestSets: HttpRequestSet[]
    environments: Environment[]
    loadItems: () => Promise<{ requestSets: HttpRequestSet[], environments: Environment[] }>
    saveItem: (item: TabItem) => Promise<boolean | ErrorTransfer>
}

export interface ItemsContextType {
    state: ItemsState
    dispatch: React.Dispatch<ItemsAction>
}