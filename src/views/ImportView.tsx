import { Box, Button, Card, MenuItem, Modal, Paper, Select, TextField, Typography } from "@mui/material"
import { queries, styles } from "../constants"
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNotification } from "../contexts/notification/useNotification";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { parseCurlCommands } from "../util/parsers/curlParser";
import ImportModalContentView from "./ImportModalContentView";
import { ImportItem } from "../types/types";
import { HttpRequestSetTransfer } from "../types/types_transfer";
import { saveRequest, saveRequestSet } from "../api/requests";
import { useQueryClient } from "@tanstack/react-query";

function ImportView() {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const queryClient = useQueryClient()

    const [importText, setImportText] = useState('')
    const [importItems, setImportItems] = useState([] as ImportItem[])

    const showNotification = () => {
        notificationContext.dispatch({
            type: 'NOTIFY',
            payload: { value: { typename: 'Error', errorMessage: t('coming_soon') } }
        })
    }

    const onImportText = () => {
        try {
            const parsedRequests = parseCurlCommands(importText);
            setImportItems(parsedRequests.map(req => ({ selected: true, item: req })));
        } catch (error) {
            notificationContext.dispatch({
                type: 'NOTIFY',
                payload: { value: { typename: 'Error', errorMessage: `${error}` }, defaultMessage: t('import_text_parse_error') }
            });
        }
    };

    const onCancelImport = () => {
        setImportItems([]);
    }

    const onConfirmImport = async () => {
        const requestsToImport = importItems
        .filter(item => item.selected)
        .map(item => item.item)
        .filter(item => item.typename === 'HttpRequest')
        
        if (!!requestsToImport.length) {
            try {
                const savedRequestSet = await saveRequestSet({
                    typename: 'HttpRequestSet',
                    label: t('imported_request_set_label'),
                    requests: [],
                } as HttpRequestSetTransfer)

                requestsToImport.forEach(async request => {
                    await saveRequest({ request: request, requestSetId: savedRequestSet.id })
                    queryClient.invalidateQueries({ queryKey: [queries.fetchRequestSets] })
                })

                

                notificationContext.dispatch({
                    type: 'NOTIFY',
                    payload: { value: {}, defaultMessage: t('import_successful') }
                })
            } catch (error) {
                notificationContext.dispatch({
                    type: 'NOTIFY',
                    payload: { value: { typename: 'Error', errorMessage: `${error}` }, defaultMessage: t('import_requests_error') }
                })
            } finally {
                setImportItems([]);
            }
        }
    }

    return (
        <Box sx={{
            padding: styles.spaces.xLarge,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: styles.dimensions.import_box_max_width,
                maxHeight: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: styles.spaces.large,
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Typography variant='h5'>{t('import_files_heading')}</Typography>
                        <Typography sx={{ marginLeft: 'auto', alignSelf: 'end' }}>{t('import_text_format_label')}</Typography>
                        <Select value={0} size='small' sx={{ marginLeft: styles.spaces.medium, alignSelf: 'end', height: '2rem' }}>
                            <MenuItem value={0} >{t('import_text_format_auto')}</MenuItem>
                        </Select>
                        <Button
                            variant='contained'
                            onClick={showNotification}
                            sx={{ marginLeft: styles.spaces.medium, width: '10rem', alignSelf: 'end', height: '2rem' }}
                        >
                            {t('choose_files_button_label')}
                        </Button>
                    </Box>
                    <Box sx={{
                        border: '2px dashed',
                        borderColor: 'text.secondary',
                        borderRadius: 1,
                        marginTop: styles.spaces.large,
                        padding: styles.spaces.xLarge,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}>
                        <FileDownloadOutlinedIcon sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />
                        <Typography variant='h6' sx={{ color: 'text.secondary', marginLeft: styles.spaces.medium }}>{t('import_files_dropzone_hint')}</Typography>
                    </Box>
                </Card>

                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: styles.spaces.large,
                    width: '100%',
                    marginTop: styles.spaces.xLarge,
                    boxSizing: 'border-box',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: styles.spaces.large,
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}>
                        <Typography variant='h5'>{t('import_text_heading')}</Typography>
                        <Typography sx={{ marginLeft: 'auto', alignSelf: 'end' }}>{t('import_text_format_label')}</Typography>
                        <Select value={0} size='small' sx={{ marginLeft: styles.spaces.medium, alignSelf: 'end', height: '2rem' }}>
                            <MenuItem value={0} >{t('import_text_format_auto')}</MenuItem>
                        </Select>
                        <Button
                            disabled={!importText.length}
                            variant='contained'
                            onClick={onImportText}
                            sx={{ marginLeft: styles.spaces.medium, width: '10rem', alignSelf: 'end', height: '2rem' }}
                        >
                            {t('import_text_button_label')}
                        </Button>
                    </Box>
                    <TextField
                        multiline
                        value={importText}
                        onChange={(e) => setImportText(e.currentTarget.value)}
                        placeholder={t('import_text_placeholder')}
                        sx={{
                            overflowY: 'auto',
                            resize: 'none',
                            backgroundColor: 'background.default',
                        }}
                    />
                </Card>
            </Box>
            <Modal
                id='import_modal'
                open={!!importItems.length}
                onClose={() => { setImportItems([]) }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    width: styles.dimensions.import_modal_width,
                    minHeight: 0,
                    maxHeight: styles.dimensions.import_modal_height,
                    padding: styles.spaces.modal_padding,
                }}>
                    <ImportModalContentView
                        importItems={importItems}
                        setImportItems={setImportItems}
                        onConfirm={onConfirmImport}
                        onCancel={onCancelImport}
                    />
                </Paper>
            </Modal>
        </Box>
    )
}

export default ImportView