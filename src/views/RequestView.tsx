import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from "@mui/material"
import RequestUrlBar from "../components/RequestUrlBar"
import { Environment, HttpRequest, HttpResponse } from "../types/types"
import { useEffect, useState } from "react"
import { HttpRequestTransfer } from "../types/types_transfer"
import RequestBody from "../components/RequestBody"
import ResponseBody from "../components/ResponseBody"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RequestHeaders from "../components/RequestHeaders"
import ItemTitleBar from "../components/ItemTitleBar"
import { useTranslation } from "react-i18next"
import { EMTPY_RESPONSE_STATUS, NO_ENVIRONMENT_ID, queries, REPAINT_TIMEOUT, styles } from "../constants"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchRequest, saveRequest as invokeSaveRequest, sendHttpRequest } from "../api/requests"
import LoadingIndicator from "../components/LoadingIndicator"
import { useEnvironment } from "../contexts/environment/useEnvironment"
import { fetchEnvironment } from "../api/environments"

interface RequestViewProps {
    requestId: number
}

function RequestView({ requestId }: RequestViewProps) {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const queryClient = useQueryClient()
    const environmentContext = useEnvironment()

    const { data: fetchedRequest } = useQuery({
        queryKey: [queries.fetchRequest, requestId],
        queryFn: () => fetchRequest(requestId),
        staleTime: Infinity,
        refetchOnMount: 'always',
    })

    const saveRequestMutation = useMutation({
        mutationFn: invokeSaveRequest,
        onSuccess: (_result, input) => {
            queryClient.invalidateQueries({ queryKey: [queries.fetchRequestSets] })
            queryClient.invalidateQueries({ queryKey: [queries.fetchRequest] })
            setIsModified(false)
            tabsContext.dispatch({ type: 'UPDATE_TAB', tabItem: { typename: 'HttpRequest', id: input.request.id ?? -1, label: input.request.label } })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_saved') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_save_request') } })
        }
    })

    const [isModified, setIsModified] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [response, setResponse] = useState({ status: 0, body: undefined } as HttpResponse)
    const [request, setRequest] = useState(fetchedRequest)

    useEffect(() => {
        if (fetchedRequest) {
            setRequest(fetchedRequest)
        }
    }, [fetchedRequest])

    const modifyRequest = (updatedRequest: HttpRequest) => {
        setRequest(prev => {
            if (!prev) {
                return prev
            }

            return { ...prev, ...updatedRequest }
        })

        setIsModified(true)
    }

    const syncRequestToQueryCache = () => {
        if (request) {
            queryClient.setQueryData([queries.fetchRequest, requestId], request)
        }
    }

    const onLabelChange = (newValue: string) => {
        if (request) {
            modifyRequest({ ...request, label: newValue })
        }
    }

    const onSave = async () => {
        if (request) {
            syncRequestToQueryCache()
            saveRequestMutation.mutate({ request: request as HttpRequestTransfer })
        }
    }

    const sendRequest = async (request?: HttpRequest) => {
        if (!request || !setResponse) {
            return
        }

        setIsSending(true)

        const environmentId = environmentContext.state.activeEnvironmentId
        const environment: Environment | undefined = environmentId !== NO_ENVIRONMENT_ID
            ? await queryClient.ensureQueryData({
                queryKey: [queries.fetchEnvironment, environmentId],
                queryFn: () => fetchEnvironment(environmentId)
            })
            : undefined

        setTimeout(() => {
            const req = { ...request, body: request.body ?? '' }
            sendHttpRequest(req, environment)
                .then(setResponse)
                .catch(error => {
                    setResponse({ status: EMTPY_RESPONSE_STATUS })
                    notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_send_request') } })
                })
                .finally(() => setIsSending(false))
        }, REPAINT_TIMEOUT)
    }

    return <Box sx={{
        width: '100%',
        height: '100%',
    }}> {request &&
        <Box id='requestView_root'
            sx={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                padding: styles.spaces.medium
            }}>
            <Box id='requestView_header' sx={{
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: styles.spaces.medium,
            }}>
                <ItemTitleBar item={request} isModified={isModified} onItemSave={onSave} onLabelChange={onLabelChange} />
                <RequestUrlBar
                    request={request}
                    updateRequest={modifyRequest}
                    sendRequest={sendRequest}
                    syncRequest={syncRequestToQueryCache}
                />
            </Box>
            <Box id='requestView_content' sx={{
                width: '100%',
                minHeight: 0,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
            }}>
                <Box id='requestView_contentLeft' sx={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                }}>
                    <Accordion
                        defaultExpanded
                        disableGutters
                        elevation={0}
                        sx={{ backgroundColor: 'transparent' }}
                    >
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.dark',
                            }}
                        >
                            <Typography component="span">{t('request_body')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RequestBody
                                request={request}
                                updateRequest={modifyRequest}
                                syncRequest={syncRequestToQueryCache}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        defaultExpanded
                        disableGutters
                        elevation={0}
                        sx={{ backgroundColor: 'transparent' }}
                    >
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.dark',
                            }}
                        >
                            <Typography component="span">{t('request_headers')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RequestHeaders
                                request={request}
                                updateRequest={modifyRequest}
                                syncRequest={syncRequestToQueryCache}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ margin: styles.spaces.medium }} />
                <Box id='requestView_contentRight' sx={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                }}>
                    <Accordion
                        defaultExpanded
                        disableGutters
                        elevation={0}
                        sx={{
                            minHeight: 0,
                            minWidth: 0,
                            backgroundColor: 'transparent',
                        }}>
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.dark',
                            }}
                        >
                            <Typography component="span">{t('request_response')}</Typography>
                            {response.status > EMTPY_RESPONSE_STATUS && <Typography sx={{ color: 'secondary.main', paddingLeft: styles.spaces.medium }}>
                                {`[${response.status}]`}
                            </Typography>}
                        </AccordionSummary>
                        <AccordionDetails sx={{
                            minHeight: 0,
                            minWidth: 0,
                        }}>
                            {isSending
                                ? <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    flexGrow: 1,
                                }}>
                                    <LoadingIndicator sx={{ width: 80, height: 80, color: 'divider' }} />
                                </Box>
                                : <ResponseBody
                                    response={response}
                                    updateResponse={setResponse}
                                />}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>}
    </Box>
}

export default RequestView