import {
    List,
    Box,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
} from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CategoryTitleBar from "../components/CategoryTitleBar";
import { useTranslation } from "react-i18next";
import CustomListItem from "../components/CustomListItem";
import ContextMenu from "../components/ContextMenu";
import { styles } from "../constants";

interface RequestListProps {
}

function RequestListView({ }: RequestListProps) {
    const appContext = useContext(AppContext)
    const { t } = useTranslation()

    const openItem = (requestSetIndex: number, requestIndex: number) => {
        const item = appContext.appState.requestSets[requestSetIndex].requests[requestIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_request_sets')}
                actions={[
                    { label: t('create_item'), callback: () => { console.log('create new request') } }
                ]}
            />
            {
                appContext.appState.requestSets.map((requestSet, requestSetIndex) =>
                    <Accordion defaultExpanded disableGutters key={`RequestSet_${requestSetIndex}`}>
                        <AccordionSummary
                            expandIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                flexDirection: 'row-reverse',
                                color: 'primary.main',
                                padding: styles.padding.default,
                                paddingTop: styles.padding.small,
                                paddingBottom: styles.padding.small,
                            }}
                        >
                            <Typography component="span">{requestSet.label}</Typography>
                            <ContextMenu
                                actions={[{ label: t('delete_item'), callback: () => console.log(t('delete_item')) }]}
                                sx={{ marginLeft: 'auto' }}
                            />
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                            <List sx={{ padding: 0 }}>
                                {requestSet.requests.map((request, requestIndex) =>
                                    <CustomListItem
                                        key={`RequestListItem_${requestIndex}`}
                                        item={request}
                                        icon={PlayArrowIcon}
                                        onDoubleClick={() => openItem(requestSetIndex, requestIndex)}
                                        index={requestIndex}
                                    />
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )}
        </Box>)
}

export default RequestListView