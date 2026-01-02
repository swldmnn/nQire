import { Box, List } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import CategoryTitleBar from "../components/CategoryTitleBar";
import { useTranslation } from 'react-i18next';
import CustomListItem from "../components/CustomListItem";
import { invoke } from "@tauri-apps/api/core";
import { EnvironmentTransfer } from "../types/types_transfer";
import { showResultNotification } from "../helpers/notificationHelper";

function EnvironmentListView() {
    const appContext = useContext(AppContext)
    const { t } = useTranslation()

    const openItem = (environmentIndex: number) => {
        const item = appContext.appState.environments[environmentIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    const createNewEnvironment = async () => {
        invoke("save_environment", {
            environment: {
                typename: 'Environment',
                label: 'new_environment',
                values: [],
            } as EnvironmentTransfer
        })
            .then(result => showResultNotification(appContext, result, t('item_saved')))
            .catch(error => showResultNotification(appContext, error, t('error_create_environment')))
    }

    const deleteEnvironment = async () => {
        invoke("delete_environment", {
            environmentId: 0 //TODO pass correct id
        })
            .then(result => showResultNotification(appContext, result, t('item_deleted')))
            .catch(error => showResultNotification(appContext, error, t('error_delete_environment')))
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_environments')}
                actions={[
                    { label: t('create_item'), callback: () => { createNewEnvironment() } }
                ]}
            />
            <List>
                {appContext.appState.environments.map((environment, index) =>
                    <CustomListItem
                        key={`EnvironmentListItem_${index}`}
                        index={index}
                        item={environment}
                        onDoubleClick={() => openItem(index)}
                        icon={AdjustIcon}
                        actions={[{ label: t('delete_item'), callback: () => deleteEnvironment() }]}
                    />
                )}
            </List>
        </Box>)
}

export default EnvironmentListView