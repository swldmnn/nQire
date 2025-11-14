import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AdjustIcon from '@mui/icons-material/Adjust';

function EnvironmentList() {
    return (
        <Box>
            <Accordion defaultExpanded disableGutters key={`Environments`}>
                <AccordionSummary
                    expandIcon={<KeyboardArrowDownIcon />}
                    sx={{
                        flexDirection: 'row-reverse',
                        color: 'primary.main',
                    }}
                >
                    <Typography component="span">Environments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        <ListItem key={'EnvironmentListItem_1'}>
                            <ListItemButton onDoubleClick={() => { }}>
                                <ListItemIcon>
                                    <AdjustIcon />
                                </ListItemIcon>
                                <ListItemText primary={'DEV'} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'EnvironmentListItem_2'}>
                            <ListItemButton onDoubleClick={() => { }}>
                                <ListItemIcon>
                                    <AdjustIcon />
                                </ListItemIcon>
                                <ListItemText primary={'STAGE'} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'EnvironmentListItem_3'}>
                            <ListItemButton onDoubleClick={() => { }}>
                                <ListItemIcon>
                                    <AdjustIcon />
                                </ListItemIcon>
                                <ListItemText primary={'PROD'} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>)
}

export default EnvironmentList