import { Box, MenuItem, Select, SxProps, Theme } from "@mui/material"
import { useContext } from "react";
import { AppContext } from "../AppContext";

interface EnvironmentChooserProps {
    sx?: SxProps<Theme>;
}

function EnvironmentChooser({ sx }: EnvironmentChooserProps) {

    const appContext = useContext(AppContext)

    const onChange = (newValue: string) => {
        appContext.updateAppState({...appContext.appState, activeEnvironment: newValue})
    }

    return (
        <Box sx={[...(Array.isArray(sx) ? sx : [sx])]}>
            <Select
                name="activeEnvironment"
                value={appContext.appState.activeEnvironment}
                onChange={(e) => onChange(e.target.value)}
                size='small'
            >
                <MenuItem value="none" key='envItem_none'>No environment</MenuItem>
                {
                    appContext.appState.environments.map(environment => 
                        <MenuItem value={environment.label} key={`envItem_${environment.label}`}>{environment.label}</MenuItem>
                    )
                }
            </Select>
        </Box>
    )
}

export default EnvironmentChooser