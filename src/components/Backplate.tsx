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
            backgroundColor: 'background.default',
        }}>
            <Logo sx={{
                width: '65%',
                height: '65%',
                color: 'divider',
                margin: 'auto',
                opacity: '50%',
            }}></Logo>
        </Box>
    )
}

export default Backplate