import { AppCtx } from "../AppContext";
import { isError } from "../types/types_transfer";

export function showResultNotification(
    appContext: AppCtx,
    result: any,
    defaultMessage?: string,
) {
    let message = undefined

    if (isError(result)) {
        message = result.errorMessage
    }

    if (!message && !defaultMessage) {
        return
    }

    appContext.showNotification({
        open: true,
        message: message ?? defaultMessage ?? '',
        type: isError(result) ? 'error' : 'success',
        closeAfterMillis: 5000,
    })
}