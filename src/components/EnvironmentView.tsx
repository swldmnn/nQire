import { Box, Typography } from "@mui/material"
import { Environment } from "./types"

interface EnvironmentViewProps {
    environment: Environment
}

function EnvironmentView({ environment }: EnvironmentViewProps) {
    return (
        <Box sx={{ padding: '1rem' }}>
            <Typography sx={{ color: 'text.primary' }}>{environment.label}</Typography>
        </Box>
    )
}

export default EnvironmentView