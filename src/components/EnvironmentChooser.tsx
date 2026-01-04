import { Box, MenuItem, Select, SxProps, Theme } from "@mui/material"
import { useContext } from "react";
import { AppContext } from "../AppContext";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../contexts/environment/useEnvironment";

interface EnvironmentChooserProps {
    sx?: SxProps<Theme>;
}

function EnvironmentChooser({ sx }: EnvironmentChooserProps) {

    const appContext = useContext(AppContext)
    const { t } = useTranslation()
    const environmentContext = useEnvironment()

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
                    appContext.appState.environments.map(environment =>
                        <MenuItem value={environment.id} key={`envItem_${environment.label}`}>{environment.label}</MenuItem>
                    )
                }
            </Select>
        </Box>
    )
}

export default EnvironmentChooser