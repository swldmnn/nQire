import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material"
import RequestUrlBar from "./RequestUrlBar";
import { HttpRequest, HttpRequestResponseProps, HttpResponse } from "./types";
import { useState } from "react";
import { HttpRequestTransfer, HttpResponseTransfer } from "./types_transfer";
import { invoke } from "@tauri-apps/api/core";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RequestHeaders from "./RequestHeaders";
import TitleBar from "./TitleBar";

interface NewRequestViewProps extends HttpRequestResponseProps {
}

function RequestView({ request: inputRequest }: NewRequestViewProps) {
    if (!inputRequest) {
        return null
    }

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

    const onSave = () => {
        setIsModified(false)
        return false
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
        <TitleBar item={request} isModified={isModified} onItemSave={onSave} onLabelChange={onLabelChange} />
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
                <Typography component="span">Body</Typography>
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
                <Typography component="span">Headers</Typography>
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
                <Typography component="span">Response</Typography>
                {response.status > 0 && <Typography sx={{ color: 'secondary.main', paddingLeft: '.5rem' }}>{`[${response.status}]`}</Typography>}
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