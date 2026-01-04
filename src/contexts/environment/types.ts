export type EnvironmentAction =
    | { type: 'SET_ACTIVE_ENVIRONMENT', environmentId: number }

export interface EnvironmentState {
    activeEnvironmentId: number
}

export interface EnvironmentContextType {
    state: EnvironmentState
    dispatch: React.Dispatch<EnvironmentAction>
}