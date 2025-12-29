import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";

interface CategoryTitleBarProps {
    title: string
}

function CategoryTitleBar({ title }: CategoryTitleBarProps) {

    const ITEM_HEIGHT = 48;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box sx={{ padding: '.8rem', color: 'primary.main', backgroundColor: 'background.default', display: 'flex' }}>
            <Typography variant="button">{title}</Typography>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ marginLeft: 'auto' }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    },
                    list: {
                        'aria-labelledby': 'long-button',
                    },
                }}
            >
                <MenuItem key={'menuItem_'} selected={false} onClick={handleClose}>
                    New
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default CategoryTitleBar