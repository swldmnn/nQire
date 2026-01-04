import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material"
import RequestUrlBar from "../components/RequestUrlBar"
import { HttpRequest, HttpRequestResponseProps, HttpResponse } from "../types/types"
import { useState } from "react"
import { HttpRequestTransfer, HttpResponseTransfer } from "../types/types_transfer"
import { invoke } from "@tauri-apps/api/core"
import RequestBody from "../components/RequestBody"
import ResponseBody from "../components/ResponseBody"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RequestHeaders from "../components/RequestHeaders"
import ItemTitleBar from "../components/ItemTitleBar"
import { useTranslation } from "react-i18next"
import { styles } from "../constants"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useItems } from "../contexts/items/useItems"

interface NewRequestViewProps extends HttpRequestResponseProps {
}

function RequestView({ request: inputRequest }: NewRequestViewProps) {
    if (!inputRequest) {
        return null
    }

    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const itemsContext = useItems()

    const [request, setRequest] = useState({ ...inputRequest })
    const [response, setResponse] = useState({ status: 0, body: undefined } as HttpResponse)
    const [isModified, setIsModified] = useState(false)

    const modifyRequest = (request: HttpRequest) => {
        setRequest(request)
        setIsModified(true)
    }

    const onLabelChange = (newValue: string) => {
        modifyRequest({ ...request, label: newValue })
    }

    const onSave = async () => {
        try {
            const result = await itemsContext.state.saveItem(request)

            if (result === true) {
                const { requestSets, environments } = await itemsContext.state.loadItems()
                itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })

                setIsModified(false)
                tabsContext.dispatch({ type: 'UPDATE_TAB', tabItem: request })
            }
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_saved') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_save_request') } })
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

        <Grid container spacing={0}>
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
        </Grid>
    </Box>
}

export default RequestView