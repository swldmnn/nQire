import { Box, Typography } from "@mui/material"
import { styles } from "../constants"
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

function ImportView() {
    return (
        <Box sx={{ padding: styles.spaces.large }}>
            <EngineeringOutlinedIcon sx={{ fontSize: 28 }} />
            <Typography variant='button'> Under construction</Typography>
        </Box>
    )
}

export default ImportView