import {
    List,
    Box,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    useColorScheme,
    Modal,
    TextField,
    Paper,
    Button,
} from "@mui/material"
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CategoryTitleBar from "../components/CategoryTitleBar"
import { useTranslation } from "react-i18next"
import CustomListItem from "../components/CustomListItem"
import ContextMenu from "../components/ContextMenu"
import { queries, styles } from "../constants"
import { HttpRequestSetTransfer, HttpRequestTransfer } from "../types/types_transfer"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchRequestSets,
    saveRequest as invokeSaveRequest,
    saveRequestSet as invokeSaveRequestSet,
    deleteRequest as invokeDeleteRequest,
    deleteRequestSet as invokeDeleteRequestSet,
} from "../api/requests";
import { useState } from "react";
import { HttpMethod } from "../types/types";

interface RequestListProps {
}

function RequestListView({ }: RequestListProps) {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const queryClient = useQueryClient()

    const { mode } = useColorScheme();
    const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

    const { data: requestSets } = useQuery({
        queryKey: [queries.fetchRequestSets],
        queryFn: fetchRequestSets
    })

    const saveRequestMutation = useMutation({
        mutationFn: invokeSaveRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queries.fetchRequestSets] })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_saved') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_request') } })
        }
    })

    const saveRequestSetMutation = useMutation({
        mutationFn: invokeSaveRequestSet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queries.fetchRequestSets] })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_saved') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_request_set') } })
        }
    })

    const deleteRequestSetMutation = useMutation({
        mutationFn: invokeDeleteRequestSet,
        onSuccess: (_result, requestSetId) => {
            if (requestSets) {
                requestSets.find(set => set.id === requestSetId)?.requests.forEach(request => {
                    tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: { typename: 'HttpRequest', id: request.id, label: '' } })
                })
            }
            queryClient.invalidateQueries({ queryKey: [queries.fetchRequestSets] })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_deleted') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_request_set') } })
        }
    })

    const deleteRequestMutation = useMutation({
        mutationFn: invokeDeleteRequest,
        onSuccess: (_result, requestId) => {
            queryClient.invalidateQueries({ queryKey: [queries.fetchRequestSets] })
            tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: { typename: 'HttpRequest', id: requestId, label: '' } })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_deleted') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_request') } })
        }
    })

    const [renameRequestSetIndex, setRenameRequestSetIndex] = useState(-1)
    const [renameText, setRenameText] = useState('')

    const openItem = (requestSetIndex: number, requestIndex: number) => {
        if (requestSets) {
            const item = requestSets[requestSetIndex].requests[requestIndex]
            tabsContext.dispatch({ type: 'OPEN_TAB', tabItem: { typename: item.typename, id: item.id, label: item.label } })
        }
    }

    const createRequest = async (requestSetIndex: number) => {
        if (requestSets) {
            saveRequestMutation.mutate({
                request: {
                    typename: 'HttpRequest',
                    id: undefined,
                    label: t('new_request_label'),
                    url: t('new_request_url'),
                    method: 'GET' as HttpMethod,
                    headers: [],
                    body: '',
                } as HttpRequestTransfer,
                requestSetId: requestSets[requestSetIndex].id
            })
        }
    }

    const createRequestSet = async () => {
        if (requestSets) {
            saveRequestSetMutation.mutate({
                typename: 'HttpRequestSet',
                label: t('new_request_set_label'),
                requests: [],
            } as HttpRequestSetTransfer)
        }
    }

    const deleteRequest = async (requestSetIndex: number, requestIndex: number) => {
        if (requestSets) {
            deleteRequestMutation.mutate(requestSets[requestSetIndex].requests[requestIndex].id)
        }
    }

    const deleteRequestSet = async (index: number) => {
        if (requestSets) {
            deleteRequestSetMutation.mutate(requestSets[index].id)
        }
    }

    const openRenameModal = (itemname: string, itemIndex: number) => {
        setRenameText(itemname)
        setRenameRequestSetIndex(itemIndex)
    }

    const renameRequestSet = () => {
        const requestSet = requestSets?.[renameRequestSetIndex]
        setRenameRequestSetIndex(-1)

        if (requestSet && requestSet.label !== renameText) {
            saveRequestSetMutation.mutate({
                ...requestSet,
                label: renameText,
                typename: 'HttpRequestSet',
                requests: [],
            })
        }
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_request_sets')}
                actions={[{ label: t('create_item'), callback: () => createRequestSet() }]}
            />
            {
                requestSets && requestSets.map((requestSet, requestSetIndex) =>
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
                                minWidth: 0,
                                '& .MuiAccordionSummary-content': {
                                    minWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                            }}
                        >
                            <Typography noWrap component="span" sx={{ minWidth: 0, flex: 1 }}>{requestSet.label}</Typography>
                            <ContextMenu
                                actions={[
                                    { label: t('delete_item'), callback: () => deleteRequestSet(requestSetIndex) },
                                    { label: t('add_item'), callback: () => createRequest(requestSetIndex) },
                                    { label: t('rename_item'), callback: () => { openRenameModal(requestSet.label, requestSetIndex) } },
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
                                        className={`http-${request.method.toLowerCase()} ${themeClass}`}
                                    />
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )}
            <Modal
                id='rename_request_set_modal'
                open={renameRequestSetIndex >= 0}
                onClose={() => { setRenameRequestSetIndex(-1) }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{
                    width: styles.dimensions.rename_item_modal_width,
                    padding: styles.spaces.modal_padding,
                }}>
                    <Typography variant='h6'>
                        {t('rename_item_modal_title')}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                    }}>
                        <TextField
                            value={renameText}
                            size='small'
                            onChange={(e) => setRenameText(e.currentTarget.value)}
                            sx={{
                                flexGrow: 1,
                                marginRight: styles.spaces.medium
                            }}
                        />
                        <Button variant='contained' onClick={renameRequestSet}>{t('ok')}</Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>)
}

export default RequestListView