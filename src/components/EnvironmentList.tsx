import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import CategoryTitleBar from "./CategoryTitleBar";

function EnvironmentList() {
    const appContext = useContext(AppContext)

    const openItem = (environmentIndex: number) => {
        const item = appContext.appState.environments[environmentIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    return (
        <Box>
            <CategoryTitleBar title="Environments" />

            <List>
                {appContext.appState.environments.map((environment, index) =>
                    <ListItem key={`EnvironmentListItem_${index}`}>
                        <ListItemButton onDoubleClick={() => { openItem(index) }}>
                            <ListItemIcon>
                                <AdjustIcon />
                            </ListItemIcon>
                            <ListItemText primary={environment.label} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>

        </Box>)
}

export default EnvironmentList