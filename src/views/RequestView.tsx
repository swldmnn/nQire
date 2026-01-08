import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material"
import RequestUrlBar from "../components/RequestUrlBar"
import { HttpRequest, HttpResponse } from "../types/types"
import { useEffect, useState } from "react"
import { HttpRequestTransfer, HttpResponseTransfer } from "../types/types_transfer"
import { invoke } from "@tauri-apps/api/core"
import RequestBody from "../components/RequestBody"
import ResponseBody from "../components/ResponseBody"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RequestHeaders from "../components/RequestHeaders"
import ItemTitleBar from "../components/ItemTitleBar"
import { useTranslation } from "react-i18next"
import { queries, styles } from "../constants"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchRequest, saveRequest as invokeSaveRequest } from "../api/requests"

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

    async function sendRequest(request?: HttpRequest) {
        if (!request || !setResponse) {
            return
        }

        const req = { ...request, body: request.body ?? '' }
        const response = await invoke("send_http_request", { request: req as HttpRequestTransfer }) as HttpResponseTransfer
        setResponse(response as HttpResponse)
    }

    return <Box sx={{
        height: '100%',
        width: '100%',
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    }}>

        {request && <Grid container spacing={0}>
            <Grid size={12}>
                <ItemTitleBar item={request} isModified={isModified} onItemSave={onSave} onLabelChange={onLabelChange} />
            </Grid>
            <Grid size={12}>
                <RequestUrlBar
                    request={request}
                    setRequest={modifyRequest}
                    sendRequest={sendRequest}
                />
            </Grid>
            <Grid size={6}>
                <Box sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
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
            </Grid>
            <Grid size={6}>

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
                        {response.status > 0 && <Typography sx={{ color: 'secondary.main', paddingLeft: styles.spaces.medium }}>{`[${response.status}]`}</Typography>}
                    </AccordionSummary>
                    <AccordionDetails sx={{
                        minHeight: 0,
                        minWidth: 0,
                    }}>
                        <ResponseBody
                            response={response}
                            setResponse={setResponse}
                        />
                    </AccordionDetails>
                </Accordion>

            </Grid>
        </Grid>}
    </Box>
}

export default RequestView