import { Box, IconButton, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ContextMenuProps {
    actions: ContextMenuAction[]
    sx?: SxProps<Theme>;
}

interface ContextMenuAction {
    label: string,
    callback: () => void
}

function ContextMenu({ actions, sx }: ContextMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box sx={[...(Array.isArray(sx) ? sx : [sx])]}>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick(e)
                }}
                size="small"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            width: '8rem',
                        },
                    },
                    backdrop: {
                        onClick: (e) => e.stopPropagation(),
                    },
                }}
            >
                {
                    actions.map(action =>
                        <MenuItem
                            key={`menuItem_${action.label}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClose()
                                action.callback()
                            }}>
                            {action.label}
                        </MenuItem>)
                }
            </Menu>
        </Box>
    )
}


export default ContextMenu