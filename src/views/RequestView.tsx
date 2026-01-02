import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material"
import RequestUrlBar from "../components/RequestUrlBar";
import { HttpRequest, HttpRequestResponseProps, HttpResponse } from "../types/types";
import { useContext, useState } from "react";
import { HttpRequestTransfer, HttpResponseTransfer } from "../types/types_transfer";
import { invoke } from "@tauri-apps/api/core";
import RequestBody from "../components/RequestBody";
import ResponseBody from "../components/ResponseBody";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RequestHeaders from "../components/RequestHeaders";
import ItemTitleBar from "../components/ItemTitleBar";
import { AppContext } from "../AppContext";
import { useTranslation } from "react-i18next";
import { styles } from "../constants";
import { showResultNotification } from "../helpers/notificationHelper";

interface NewRequestViewProps extends HttpRequestResponseProps {
}

function RequestView({ request: inputRequest }: NewRequestViewProps) {
    if (!inputRequest) {
        return null
    }

    const appContext = useContext(AppContext)
    const { t } = useTranslation()

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
        appContext.saveItem(request)
            .then(result => {
                if (result === true) {
                    setIsModified(false)
                }
                showResultNotification(appContext, result, t('item_saved'))
            })
            .catch(error => showResultNotification(appContext, error, t('error_save_request')))
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
        bgcolor: 'grey.850',
        overflow: 'auto',
    }}>
        <ItemTitleBar item={request} isModified={isModified} onItemSave={onSave} onLabelChange={onLabelChange} />
        <RequestUrlBar
            request={request}
            setRequest={modifyRequest}
            sendRequest={sendRequest}
        />

        <Accordion defaultExpanded disableGutters>
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

        <Accordion defaultExpanded disableGutters>
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

        <Accordion defaultExpanded disableGutters sx={{
            minHeight: 0,
            minWidth: 0,
        }}>
            <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                sx={{
                    flexDirection: 'row-reverse',
                    color: 'primary.dark',
                }}
            >
                <Typography component="span">{t('request_response')}</Typography>
                {response.status > 0 && <Typography sx={{ color: 'secondary.main', paddingLeft: styles.padding.default }}>{`[${response.status}]`}</Typography>}
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
    </Box>
}

export default RequestView