import { Box, Typography } from "@mui/material"
import { styles } from "../constants"
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

function ExportView() {
    return (
        <Box sx={{ padding: styles.spaces.large, display: 'flex', alignItems: 'center' }}>
            <EngineeringOutlinedIcon sx={{ fontSize: 28, marginRight: styles.spaces.medium }} />
            <Typography variant='button'>! Under construction !</Typography>
        </Box>
    )
}

export default ExportView