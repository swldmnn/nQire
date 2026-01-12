import { Box, Divider, Typography } from "@mui/material"
import { styles } from "../constants"
import CloseIcon from '@mui/icons-material/Close'

interface TabHeaderProps {
    label: string,
    onClose: () => void
}

function TabHeader({ label, onClose }: TabHeaderProps) {

    return <Box sx={{
        display: 'flex',
        flexDirection: 'row',
    }}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: styles.spaces.medium,
        }}>
            <Typography noWrap sx={{ maxWidth: styles.dimensions.max_tab_width }}>{label}</Typography>
            <CloseIcon
                onClick={(e) => { e.stopPropagation(); onClose() }}
                sx={{ height: '1rem', alignSelf: 'center', color: 'secondary.main' }}
            />
        </Box>
        <Divider
            orientation='vertical'
            flexItem
            sx={{ height: '80%', alignSelf: 'center' }}
        />
    </Box>

}

export default TabHeader