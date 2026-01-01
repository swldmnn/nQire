import { Box, Typography } from "@mui/material"
import { styles } from "../constants";
import ContextMenu from "./ContextMenu";
import { Action } from "../types/types";

interface CategoryTitleBarProps {
    title: string
    actions: Action[]
}

function CategoryTitleBar({ title, actions }: CategoryTitleBarProps) {
    return (
        <Box sx={{
            padding: styles.padding.default,
            color: 'primary.main',
            display: 'flex',
            flexDirection: 'row',
            boxSizing: 'border-box',
            alignItems: 'center'
        }}>
            <Typography variant="button">{title}</Typography>
            <ContextMenu actions={actions} sx={{ marginLeft: 'auto' }} />
        </Box>
    )
}

export default CategoryTitleBar