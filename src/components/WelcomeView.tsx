import { Box } from "@mui/material"
import Logo from "./Logo"

function WelcomeView() {

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'clip',
            opacity: '50%',
        }}>
            <Logo sx={{ width: '40rem', height: '40rem', color: 'divider', margin: 'auto' }}></Logo>
        </Box>
    )
}

export default WelcomeView