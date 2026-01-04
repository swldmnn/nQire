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
import { HttpRequestSetTransfer, HttpRequestTransfer } from "../types/types_transfer";
import { invoke } from "@tauri-apps/api/core";
import { useNotification } from "../contexts/notification/useNotification";

interface RequestListProps {
}

function RequestListView({ }: RequestListProps) {
    const appContext = useContext(AppContext)
    const { t } = useTranslation()
    const notificationContext = useNotification()

    const openItem = (requestSetIndex: number, requestIndex: number) => {
        const item = appContext.appState.requestSets[requestSetIndex].requests[requestIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    const createNewRequest = async (requestSetIndex: number) => {
        invoke("save_request", {
            request: {
                typename: 'HttpRequest',
                id: undefined,
                label: t('new_request_label'),
                url: t('new_request_url'),
                method: 'GET',
                headers: [],
                body: '',
            } as HttpRequestTransfer,
            requestSetId: appContext.appState.requestSets[requestSetIndex].id
        })
            .then(result => {
                appContext.initialize()
                notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_saved') } })
            })
            .catch(error => notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_request') } }))
    }

    const createNewRequestSet = async () => {
        invoke("save_request_set", { //TODO set correct values
            requestSet: {
                typename: 'HttpRequestSet',
                id: 0,
                label: 'new_request_set',
                requests: [],
            } as HttpRequestSetTransfer
        })
            .then(result => notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_saved') } }))
            .catch(error => notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_request_set') } }))
    }

    const deleteRequest = async (requestSetIndex: number, requestIndex: number) => {
        invoke("delete_request", {
            requestId: appContext.appState.requestSets[requestSetIndex].requests[requestIndex].id
        })
            .then(result => {
                appContext.initialize()
                //TODO sync open items
                notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_deleted') } })
            })
            .catch(error => notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_request') } }))
    }

    const deleteRequestSet = async () => {
        invoke("delete_request_set", {
            requestSetId: 0 //TODO set correct id
        })
            .then(result => notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_deleted') } }))
            .catch(error => notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_request_set') } }))
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_request_sets')}
                actions={[{ label: t('create_item'), callback: () => createNewRequestSet() }]}
            />
            {
                appContext.appState.requestSets.map((requestSet, requestSetIndex) =>
                    <Accordion
                        elevation={0}
                        defaultExpanded
                        disableGutters
                        key={`RequestSet_${requestSetIndex}`}
                        sx={{ backgroundColor: 'transparent' }}
                    >
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.main',
                                padding: styles.spaces.medium,
                                paddingTop: styles.spaces.small,
                                paddingBottom: styles.spaces.small,
                            }}
                        >
                            <Typography component="span">{requestSet.label}</Typography>
                            <ContextMenu
                                actions={[
                                    { label: t('delete_item'), callback: () => deleteRequestSet() },
                                    { label: t('add_item'), callback: () => createNewRequest(requestSetIndex) },
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
                                        actions={[{ label: t('delete_item'), callback: () => deleteRequest(requestSetIndex, requestIndex) }]}
                                    />
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )}
        </Box>)
}

export default RequestListView