import { Box, SxProps, Theme } from "@mui/material";
import Logo from "./Logo"

interface LoadingIndicatorProps {
    sx?: SxProps<Theme>;
}

function LoadingIndicator({ sx }: LoadingIndicatorProps) {
    return <Box className='loader' sx={sx}>
        <Logo sx={sx} />
    </Box>
}

export default LoadingIndicator