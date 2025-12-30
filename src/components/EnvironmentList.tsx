import { Box, List } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import CategoryTitleBar from "./CategoryTitleBar";
import { useTranslation } from 'react-i18next';
import CustomListItem from "./CustomListItem";

function EnvironmentList() {
    const appContext = useContext(AppContext)
    const { t } = useTranslation()

    const openItem = (environmentIndex: number) => {
        const item = appContext.appState.environments[environmentIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    return (
        <Box>
            <CategoryTitleBar title={t('cat_environments')} />
            <List>
                {appContext.appState.environments.map((environment, index) =>
                    <CustomListItem
                        key={`EnvironmentListItem_${index}`}
                        index={index}
                        item={environment}
                        onDoubleClick={() => openItem(index)}
                        icon={AdjustIcon}
                    />
                )}
            </List>
        </Box>)
}

export default EnvironmentList