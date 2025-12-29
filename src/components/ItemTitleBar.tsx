import { Box, Button, Card, TextField } from "@mui/material"
import { DisplayItem } from "../types/types"
import SaveIcon from '@mui/icons-material/Save';

interface TitleBarProps {
    item: DisplayItem
    isModified: boolean
    onLabelChange: (newValue: string) => void
    onItemSave: () => void
}

function ItemTitleBar({ item, isModified, onLabelChange, onItemSave }: TitleBarProps) {
    return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                padding: '.5rem',
                boxSizing: 'border-box'
            }}>
                <TextField
                    value={item.label}
                    size='small'
                    variant='standard'
                    onChange={(e) => onLabelChange(e.currentTarget.value)}
                />
                <Box id='filler' sx={{ flexGrow: 1 }} />
                <Button
                    sx={{ color: 'secondary.main' }}
                    disabled={!isModified}
                    onClick={onItemSave}
                >
                    <SaveIcon />
                </Button>
            </Box>
    )
}

export default ItemTitleBar