import { Box, MenuItem, Select, SxProps, Theme } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useEnvironment } from "../contexts/environment/useEnvironment"
import { useQuery } from "@tanstack/react-query";
import { queries } from "../constants";
import { fetchEnvironments } from "../api/environments";

interface EnvironmentChooserProps {
    sx?: SxProps<Theme>;
}

function EnvironmentChooser({ sx }: EnvironmentChooserProps) {
    const { t } = useTranslation()
    const environmentContext = useEnvironment()

     const { data: environments } = useQuery({
        queryKey: [queries.fetchEnvironments],
        queryFn: fetchEnvironments
    })

    const onChange = (newValue: number) => {
        environmentContext.dispatch({ type: 'SET_ACTIVE_ENVIRONMENT', environmentId: newValue })
    }

    return (
        <Box sx={[...(Array.isArray(sx) ? sx : [sx])]}>
            {environments && <Select
                name="activeEnvironment"
                value={environmentContext.state.activeEnvironmentId}
                onChange={(e) => onChange(e.target.value)}
                size='small'
                sx={{ width: '100%' }}
                variant='standard'
            >
                <MenuItem value={-1} key='envItem_none'>{t('no_environment')}</MenuItem>
                {
                    environments.map(environment =>
                        <MenuItem value={environment.id} key={`envItem_${environment.label}`}>{environment.label}</MenuItem>
                    )
                }
            </Select>}
        </Box>
    )
}

export default EnvironmentChooser