import {
    List,
    Box,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
} from "@mui/material"
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CategoryTitleBar from "../components/CategoryTitleBar"
import { useTranslation } from "react-i18next"
import CustomListItem from "../components/CustomListItem"
import ContextMenu from "../components/ContextMenu"
import { styles } from "../constants"
import { HttpRequestSetTransfer, HttpRequestTransfer } from "../types/types_transfer"
import { invoke } from "@tauri-apps/api/core"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useItems } from "../contexts/items/useItems"

interface RequestListProps {
}

function RequestListView({ }: RequestListProps) {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const itemsContext = useItems()

    const openItem = (requestSetIndex: number, requestIndex: number) => {
        const item = itemsContext.state.requestSets[requestSetIndex].requests[requestIndex]
        tabsContext.dispatch({ type: 'OPEN_TAB', tabItem: { typename: item.typename, id: item.id, label: item.label } })
    }

    const createNewRequest = async (requestSetIndex: number) => {
        try {
            const result = await invoke("save_request", {
                request: {
                    typename: 'HttpRequest',
                    id: undefined,
                    label: t('new_request_label'),
                    url: t('new_request_url'),
                    method: 'GET',
                    headers: [],
                    body: '',
                } as HttpRequestTransfer,
                requestSetId: itemsContext.state.requestSets[requestSetIndex].id
            })

            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_saved') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_request') } })
        }
    }

    const createNewRequestSet = async () => {
        try {
            const result = await invoke("save_request_set", {
                requestSet: {
                    typename: 'HttpRequestSet',
                    label: t('new_request_set_label'),
                    requests: [],
                } as HttpRequestSetTransfer
            })

            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_saved') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_request_set') } })
        }
    }

    const deleteRequest = async (requestSetIndex: number, requestIndex: number) => {
        try {
            const request = itemsContext.state.requestSets[requestSetIndex].requests[requestIndex]
            const result = await invoke("delete_request", {
                requestId: request.id
            })

            tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: request })
            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_deleted') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_request') } })
        }
    }

    const deleteRequestSet = async (index: number) => {
        try {
            const requestSet = itemsContext.state.requestSets[index]
            const result = await invoke("delete_request_set", {
                requestSetId: requestSet.id
            })

            requestSet.requests.forEach(request => tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: request }))
            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_deleted') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_request_set') } })
        }
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_request_sets')}
                actions={[{ label: t('create_item'), callback: () => createNewRequestSet() }]}
            />
            {
                itemsContext.state.requestSets.map((requestSet, requestSetIndex) =>
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
                                    { label: t('delete_item'), callback: () => deleteRequestSet(requestSetIndex) },
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
                                        icon={PlayArrowOutlinedIcon}
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