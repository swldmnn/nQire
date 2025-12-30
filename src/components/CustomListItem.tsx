import { SvgIconComponent } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { DisplayItem } from "../types/types";
import { useTranslation } from "react-i18next";
import { styles } from "../constants";
import ContextMenu from "./ContextMenu";

interface CustomListItemProps {
    index: number
    item: DisplayItem
    icon: SvgIconComponent
    onDoubleClick: () => void
}

function CustomListItem({ index, item, icon: Icon, onDoubleClick }: CustomListItemProps) {
    const { t } = useTranslation()

    return (
        <ListItem key={`${item.typename}_${index}`} sx={{ padding: 0 }}>
            <ListItemButton onDoubleClick={onDoubleClick} sx={{ padding: styles.padding.default }}>
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />

            </ListItemButton>
            <ContextMenu
                actions={[{ label: t('delete_item'), callback: () => console.log(t('delete_item')) }]}
                sx={{ marginLeft: 'auto', paddingRight: styles.padding.default }}
            />
        </ListItem>
    )
}

export default CustomListItem