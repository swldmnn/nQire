import { isError } from "../../types/types_transfer"
import { Notification, NotificationAction, NotificationState, NotifyPayload } from "./types"

const DEFAULT_CLOSE_AFER_MILLIS = 5000

export const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case 'NOTIFY':
            return { showNotification: true, notification: buildNotification(action.payload) }
        case 'HIDE':
            return { ...state, showNotification: false }
        default:
            return state
    }
};

const buildNotification = (payload: NotifyPayload) => {
    const message = isError(payload.value)
        ? payload.value.errorMessage
        : (payload.defaultMessage) ?? `${payload.value}`

    return {
        message,
        type: isError(payload.value) ? 'error' : 'success',
        closeAfterMillis: payload.closeAfterMillis ?? DEFAULT_CLOSE_AFER_MILLIS,
    } as Notification
}
