import { Box, List } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { useContext } from "react";
import { AppContext } from "../AppContext";
import CategoryTitleBar from "../components/CategoryTitleBar";
import { useTranslation } from 'react-i18next';
import CustomListItem from "../components/CustomListItem";
import { invoke } from "@tauri-apps/api/core";
import { EnvironmentTransfer, isError } from "../types/types_transfer";

function EnvironmentListView() {
    const appContext = useContext(AppContext)
    const { t } = useTranslation()

    const openItem = (environmentIndex: number) => {
        const item = appContext.appState.environments[environmentIndex]
        appContext.openItem({ typename: item.typename, id: item.id, label: '' })
    }

    const createNewEnvironment = async () => {
        try {
            await invoke("save_environment", {
                environment: {
                    typename: 'Environment',
                    label: 'new_environment',
                    values: [],
                } as EnvironmentTransfer
            })

            appContext.showNotification({
                open: true,
                message: 'saved',
                type: 'success',
                closeAfterMillis: 5000,
            })
        } catch (error) {
            const message = isError(error) ? error.errorMessage : t('error_create_environment')

            appContext.showNotification({
                open: true,
                message,
                type: 'error',
                closeAfterMillis: 5000,
            })
        }
    }

    const deleteEnvironment = async () => {
        try {
            await invoke("delete_environment", {
                environmentId: 0 //TODO pass correct id
            })

            appContext.showNotification({
                open: true,
                message: 'saved',
                type: 'success',
                closeAfterMillis: 5000,
            })
        } catch (error) {
            const message = isError(error) ? error.errorMessage : t('delete_environment_failed')

            appContext.showNotification({
                open: true,
                message,
                type: 'error',
                closeAfterMillis: 5000,
            })
        }
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