import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next";
import { styles } from "../constants";
import ContextMenu from "./ContextMenu";

interface CategoryTitleBarProps {
    title: string
}

function CategoryTitleBar({ title }: CategoryTitleBarProps) {
    const { t } = useTranslation()

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
            <ContextMenu actions={[
                { label: t('create_item'), callback: () => { console.log(t('create_item')) } }
            ]} sx={{ marginLeft: 'auto' }} />
        </Box>
    )
}

export default CategoryTitleBar