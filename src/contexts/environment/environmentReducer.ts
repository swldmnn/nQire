import { EnvironmentAction, EnvironmentState } from "./types"

export const environmentReducer = (state: EnvironmentState, action: EnvironmentAction): EnvironmentState => {
    switch (action.type) {
        case 'SET_ACTIVE_ENVIRONMENT':
            return { ...state, activeEnvironmentId: action.environmentId }
        default:
            return state
    }
}