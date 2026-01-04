export type NotificationAction =
    | { type: 'NOTIFY'; payload: NotifyPayload }
    | { type: 'HIDE' }

export interface NotifyPayload {
    closeAfterMillis?: number,
    value: any,
    defaultMessage?: string
}

export interface Notification {
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    closeAfterMillis: number
}

export interface NotificationState {
    showNotification: boolean
    notification: Notification
}

export interface NotificationContextType {
    state: NotificationState;
    dispatch: React.Dispatch<NotificationAction>;
}