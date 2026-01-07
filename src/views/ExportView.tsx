import { Box, Typography } from "@mui/material"
import { styles } from "../constants"
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

function ExportView() {
    return (
        <Box sx={{ padding: styles.spaces.large }}>
            <Typography variant='button' sx={{ fontSize: 18 }}><EngineeringOutlinedIcon sx={{ fontSize: 32 }} /> Under construction</Typography>
        </Box>
    )
}

export default ExportView