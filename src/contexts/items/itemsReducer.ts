import { ItemsAction, ItemsState } from "./types"

export const itemsReducer = (state: ItemsState, action: ItemsAction): ItemsState => {
    switch (action.type) {
        case 'UPDATE_ITEMS':
            return {
                ...state,
                initialized: true,
                requestSets: action.requestSets,
                environments: action.environments
            }
        default:
            return state
    }
}
