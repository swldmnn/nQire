import { Box } from "@mui/material"
import Logo from "./Logo"

function Backplate() {
    return (
        <Box sx={{
            position: 'absolute',
            zIndex: -1,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'clip',
            opacity: '50%',
        }}>
            <Logo sx={{
                width: '70%',
                height: '70%',
                color: 'divider',
                margin: 'auto'
            }}></Logo>
        </Box>
    )
}

export default Backplate