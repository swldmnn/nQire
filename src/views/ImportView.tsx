import { Box, Button, Card, TextField, Typography } from "@mui/material"
import { styles } from "../constants"
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNotification } from "../contexts/notification/useNotification";

function ImportView() {
    const { t } = useTranslation()
    const notificationContext = useNotification()

    const [importText, setImportText] = useState('')

    const showNotification = () => {
        notificationContext.dispatch({
            type: 'NOTIFY',
            payload: { value: { typename: 'Error', errorMessage: t('coming_soon') } }
        })
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
                maxHeight: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: styles.spaces.large,
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    <Typography variant='h5'>{t('import_files_heading')}</Typography>
                    <Button
                        variant='contained'
                        onClick={showNotification}
                        sx={{ marginLeft: 'auto', width: '10rem', alignSelf: 'end' }}
                    >
                        {t('choose_files_button_label')}
                    </Button>
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
                    }}>
                        <Typography variant='h5'>{t('import_text_heading')}</Typography>
                        <Button
                            disabled={!importText.length}
                            variant='contained'
                            onClick={showNotification}
                            sx={{ marginLeft: 'auto', width: '10rem', alignSelf: 'end' }}
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
        </Box>
    )
}

export default ImportView