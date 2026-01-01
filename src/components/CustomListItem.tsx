import { SvgIconComponent } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Action, DisplayItem } from "../types/types";
import { styles } from "../constants";
import ContextMenu from "./ContextMenu";

interface CustomListItemProps {
    index: number
    item: DisplayItem
    icon: SvgIconComponent
    onDoubleClick: () => void
    actions: Action[]
}

function CustomListItem({ index, item, icon: Icon, onDoubleClick, actions }: CustomListItemProps) {
    return (
        <ListItem key={`${item.typename}_${index}`} sx={{ padding: 0 }}>
            <ListItemButton onDoubleClick={onDoubleClick} sx={{ padding: styles.padding.default }}>
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />

            </ListItemButton>
            <ContextMenu
                actions={actions}
                sx={{ marginLeft: 'auto', paddingRight: styles.padding.default }}
            />
        </ListItem>
    )
}

export default CustomListItem