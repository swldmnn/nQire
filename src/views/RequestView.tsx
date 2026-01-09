import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Grid, Typography } from "@mui/material"
import RequestUrlBar from "../components/RequestUrlBar"
import { HttpRequest, HttpResponse } from "../types/types"
import { useEffect, useState } from "react"
import { HttpRequestTransfer } from "../types/types_transfer"
import RequestBody from "../components/RequestBody"
import ResponseBody from "../components/ResponseBody"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RequestHeaders from "../components/RequestHeaders"
import ItemTitleBar from "../components/ItemTitleBar"
import { useTranslation } from "react-i18next"
import { EMTPY_RESPONSE_STATUS, queries, REPAINT_TIMEOUT, styles } from "../constants"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchRequest, saveRequest as invokeSaveRequest, sendHttpRequest } from "../api/requests"
import LoadingIndicator from "../components/LoadingIndicator"

interface RequestViewProps {
    requestId: number
}

function RequestView({ requestId }: RequestViewProps) {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const queryClient = useQueryClient()

    const { data: fetchedRequest } = useQuery({
        queryKey: [queries.fetchRequest, requestId],
        queryFn: () => fetchRequest(requestId),
    })

    const [request, setRequest] = useState(fetchedRequest)
    const [response, setResponse] = useState({ status: 0, body: undefined } as HttpResponse)
    const [isModified, setIsModified] = useState(false)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        if (fetchedRequest) {
            setRequest(fetchedRequest);
        }
    }, [fetchedRequest]);

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

    const modifyRequest = (request: HttpRequest) => {
        setRequest(request)
        setIsModified(true)
    }

    const onLabelChange = (newValue: string) => {
        if (request) {
            modifyRequest({ ...request, label: newValue })
        }
    }

    const onSave = async () => {
        if (request) {
            saveRequestMutation.mutate({ request: request as HttpRequestTransfer })
        }
    }

    const sendRequest = async (request?: HttpRequest) => {
        if (!request || !setResponse) {
            return
        }

        setIsSending(true)

        setTimeout(() => {
            const req = { ...request, body: request.body ?? '' }
            sendHttpRequest(req)
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
                    setRequest={modifyRequest}
                    sendRequest={sendRequest}
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
                                setRequest={modifyRequest}
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
                            <RequestHeaders request={request} setRequest={modifyRequest} />
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
                                    setResponse={setResponse}
                                />}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>
        }</Box>
}

export default RequestView