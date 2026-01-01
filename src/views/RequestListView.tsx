import {
    List,
    Box,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
} from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CategoryTitleBar from "../components/CategoryTitleBar";
import { useTranslation } from "react-i18next";
import CustomListItem from "../components/CustomListItem";
import ContextMenu from "../components/ContextMenu";
import { styles } from "../constants";
import { HttpRequestSetTransfer, HttpRequestTransfer, isError } from "../types/types_transfer";
import { invoke } from "@tauri-apps/api/core";

interface RequestListProps {
}

function RequestListView({ }: RequestListProps) {
    const appContext = useContext(AppContext)
    const { t } = useTranslation()

    const openItem = (requestSetIndex: number, requestIndex: number) => {
        const item = appContext.appState.requestSets[requestSetIndex].requests[requestIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    const createNewRequest = async () => {
        try {
            await invoke("save_request", { //TODO set correct values
                request: {
                    typename: 'HttpRequest',
                    id: undefined,
                    label: 'new_request',
                    url: 'https://new.request',
                    method: 'GET',
                    headers: [],
                    body: '',
                } as HttpRequestTransfer
            })

            appContext.showNotification({
                open: true,
                message: 'saved',
                type: 'success',
                closeAfterMillis: 5000,
            })
        } catch (error) {
            const message = isError(error) ? error.errorMessage : t('error_create_request')

            appContext.showNotification({
                open: true,
                message,
                type: 'error',
                closeAfterMillis: 5000,
            })
        }
    }

    const createNewRequestSet = async () => {
        try {
            await invoke("save_request_set", { //TODO set correct values
                requestSet: {
                    typename: 'HttpRequestSet',
                    id: 0,
                    label: 'new_request_set',
                    requests: [],
                } as HttpRequestSetTransfer
            })

            appContext.showNotification({
                open: true,
                message: 'saved',
                type: 'success',
                closeAfterMillis: 5000,
            })
        } catch (error) {
            const message = isError(error) ? error.errorMessage : t('error_create_request_set')

            appContext.showNotification({
                open: true,
                message,
                type: 'error',
                closeAfterMillis: 5000,
            })
        }
    }

    const deleteRequest = async () => {
        try {
            await invoke("delete_request", {
                requestId: 0 //TODO set correct id
            })

            appContext.showNotification({
                open: true,
                message: 'saved',
                type: 'success',
                closeAfterMillis: 5000,
            })
        } catch (error) {
            const message = isError(error) ? error.errorMessage : t('error_delete_request')

            appContext.showNotification({
                open: true,
                message,
                type: 'error',
                closeAfterMillis: 5000,
            })
        }
    }

    const deleteRequestSet = async () => {
        try {
            await invoke("delete_request_set", {
                requestSetId: 0 //TODO set correct id
            })

            appContext.showNotification({
                open: true,
                message: 'saved',
                type: 'success',
                closeAfterMillis: 5000,
            })
        } catch (error) {
            const message = isError(error) ? error.errorMessage : t('error_delete_request_set')

            appContext.showNotification({
                open: true,
                message,
                type: 'error',
                closeAfterMillis: 5000,
            })
        }
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_request_sets')}
                actions={[{ label: t('create_item'), callback: () => createNewRequestSet() }]}
            />
            {
                appContext.appState.requestSets.map((requestSet, requestSetIndex) =>
                    <Accordion defaultExpanded disableGutters key={`RequestSet_${requestSetIndex}`}>
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.main',
                                padding: styles.padding.default,
                                paddingTop: styles.padding.small,
                                paddingBottom: styles.padding.small,
                            }}
                        >
                            <Typography component="span">{requestSet.label}</Typography>
                            <ContextMenu
                                actions={[
                                    { label: t('delete_item'), callback: () => deleteRequestSet() },
                                    { label: t('add_item'), callback: () => createNewRequest() },
                                ]}
                                sx={{ marginLeft: 'auto' }}
                            />
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                            <List sx={{ padding: 0 }}>
                                {requestSet.requests.map((request, requestIndex) =>
                                    <CustomListItem
                                        key={`RequestListItem_${requestIndex}`}
                                        item={request}
                                        icon={PlayArrowIcon}
                                        onDoubleClick={() => openItem(requestSetIndex, requestIndex)}
                                        index={requestIndex}
                                        actions={[{ label: t('delete_item'), callback: () => deleteRequest() }]}
                                    />
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )}
        </Box>)
}

export default RequestListView