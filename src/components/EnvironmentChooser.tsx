import { Box, MenuItem, Select, SxProps, Theme } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useEnvironment } from "../contexts/environment/useEnvironment"
import { useItems } from "../contexts/items/useItems"

interface EnvironmentChooserProps {
    sx?: SxProps<Theme>;
}

function EnvironmentChooser({ sx }: EnvironmentChooserProps) {

    const { t } = useTranslation()
    const environmentContext = useEnvironment()
    const itemsContext = useItems()

    const onChange = (newValue: number) => {
        environmentContext.dispatch({ type: 'SET_ACTIVE_ENVIRONMENT', environmentId: newValue })
    }

    return (
        <Box sx={[...(Array.isArray(sx) ? sx : [sx])]}>
            <Select
                name="activeEnvironment"
                value={environmentContext.state.activeEnvironmentId}
                onChange={(e) => onChange(e.target.value)}
                size='small'
                sx={{ width: '100%' }}
                variant='standard'
            >
                <MenuItem value={-1} key='envItem_none'>{t('no_environment')}</MenuItem>
                {
                    itemsContext.state.environments.map(environment =>
                        <MenuItem value={environment.id} key={`envItem_${environment.label}`}>{environment.label}</MenuItem>
                    )
                }
            </Select>
        </Box>
    )
}

export default EnvironmentChooser