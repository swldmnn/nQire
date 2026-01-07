import { SvgIconComponent } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Action, TabItem } from "../types/types";
import { styles } from "../constants";
import ContextMenu from "./ContextMenu";

interface CustomListItemProps {
    index: number
    item: TabItem
    icon: SvgIconComponent
    onDoubleClick: () => void
    actions: Action[]
    className?: string
}

function CustomListItem({ index, item, icon: Icon, onDoubleClick, actions, className }: CustomListItemProps) {
    return (
        <ListItem key={`${item.typename}_${index}`} sx={{ padding: 0 }}>
            <ListItemButton onDoubleClick={onDoubleClick} sx={{ padding: styles.spaces.medium }}>
                <ListItemIcon>
                    <Icon className={className}/>
                </ListItemIcon>
                <ListItemText primary={item.label} />

            </ListItemButton>
            {!!actions.length && <ContextMenu
                actions={actions}
                sx={{ marginLeft: 'auto', paddingRight: styles.spaces.medium }}
            />}
        </ListItem>
    )
}

export default CustomListItem