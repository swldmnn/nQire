import { Box, List } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust'
import CategoryTitleBar from "../components/CategoryTitleBar"
import { useTranslation } from 'react-i18next'
import CustomListItem from "../components/CustomListItem"
import { invoke } from "@tauri-apps/api/core"
import { EnvironmentTransfer } from "../types/types_transfer"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useItems } from "../contexts/items/useItems"


function EnvironmentListView() {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const itemsContext = useItems()

    const openItem = (environmentIndex: number) => {
        const item = itemsContext.state.environments[environmentIndex]
        tabsContext.dispatch({ type: 'OPEN_TAB', tabItem: { typename: item.typename, id: item.id, label: item.label } })
    }

    const createNewEnvironment = async () => {
        try {
            const result = await invoke("save_environment", {
                environment: {
                    typename: 'Environment',
                    label: t('new_environment_label'),
                    values: [],
                } as EnvironmentTransfer
            })

            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_saved') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_environment') } })
        }
    }

    const deleteEnvironment = async (index: number) => {
        try {
            const environment = itemsContext.state.environments[index]
            const result = await invoke("delete_environment", { environmentId: environment.id })

            tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: environment })
            const { requestSets, environments } = await itemsContext.state.loadItems()
            itemsContext.dispatch({ type: 'UPDATE_ITEMS', requestSets, environments })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: result, defaultMessage: t('item_deleted') } })
        } catch (error) {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_environment') } })
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
                {itemsContext.state.environments.map((environment, index) =>
                    <CustomListItem
                        key={`EnvironmentListItem_${index}`}
                        index={index}
                        item={environment}
                        onDoubleClick={() => openItem(index)}
                        icon={AdjustIcon}
                        actions={[{ label: t('delete_item'), callback: () => deleteEnvironment(index) }]}
                    />
                )}
            </List>
        </Box>)
}

export default EnvironmentListView