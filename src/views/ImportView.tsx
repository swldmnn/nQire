import { Box, Paper, Typography } from "@mui/material"
import { styles } from "../constants"
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import { useTranslation } from "react-i18next";

function ImportView() {
    const { t } = useTranslation()

    return (
        <Box sx={{
            padding: styles.spaces.large, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Paper
                elevation={0}
                sx={{
                    padding: styles.spaces.large,
                    border: '1px solid',
                    borderColor: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <EngineeringOutlinedIcon sx={{ fontSize: 28, marginRight: styles.spaces.medium }} />
                <Typography variant='button'>{t('coming_soon')}</Typography>
            </Paper>
        </Box>
    )
}

export default ImportView