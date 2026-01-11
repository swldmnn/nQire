import { Box, List } from "@mui/material"
import CategoryTitleBar from "../components/CategoryTitleBar"
import { useTranslation } from 'react-i18next'
import CustomListItem from "../components/CustomListItem"
import { EnvironmentTransfer } from "../types/types_transfer"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteEnvironment as invokeDeleteEnvironment, fetchEnvironments, saveEnvironment as invokeSaveEnvironment } from "../api/environments"
import { NO_ENVIRONMENT_ID, queries } from "../constants"
import { useEnvironment } from "../contexts/environment/useEnvironment"


function EnvironmentListView() {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const queryClient = useQueryClient()
    const environmentContext = useEnvironment()

    const saveEnvironmentMutation = useMutation({
        mutationFn: invokeSaveEnvironment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queries.fetchEnvironments] })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_saved') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_create_environment') } })
        }
    })

    const deleteEnvironmentMutation = useMutation({
        mutationFn: invokeDeleteEnvironment,
        onSuccess: (_result, environment_id) => {
            if (environmentContext.state.activeEnvironmentId === environment_id) {
                environmentContext.dispatch({ type: 'SET_ACTIVE_ENVIRONMENT', environmentId: NO_ENVIRONMENT_ID })
            }
            queryClient.invalidateQueries({ queryKey: [queries.fetchEnvironments] })
            tabsContext.dispatch({ type: 'CLOSE_TAB', tabItem: { typename: 'Environment', id: environment_id, label: '' } })
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_deleted') } })
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_delete_environment') } })
        }
    })

    const { data: environments, isLoading } = useQuery({
        queryKey: [queries.fetchEnvironments],
        queryFn: fetchEnvironments
    })

    const openItem = (environmentIndex: number) => {
        const item = environments?.[environmentIndex]
        if (item) {
            tabsContext.dispatch({ type: 'OPEN_TAB', tabItem: { typename: item.typename, id: item.id, label: item.label } })
        }
    }

    const createEnvironment = async () => {
        saveEnvironmentMutation.mutate({
            typename: 'Environment',
            label: t('new_environment_label'),
            values: [],
        } as EnvironmentTransfer)
    }

    const onDeleteEnvironment = async (index: number) => {
        const environment = environments?.[index]
        if (environment) {
            deleteEnvironmentMutation.mutate(environment.id)
        }
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_environments')}
                actions={[
                    { label: t('create_item'), callback: () => { createEnvironment() } }
                ]}
            />
            {!isLoading && environments && <List>
                {environments.map((environment, index) =>
                    <CustomListItem
                        key={`EnvironmentListItem_${index}`}
                        index={index}
                        item={environment}
                        onDoubleClick={() => openItem(index)}
                        icon={CropFreeOutlinedIcon}
                        actions={[{ label: t('delete_item'), callback: () => onDeleteEnvironment(index) }]}
                    />
                )}
            </List>}
        </Box>)
}

export default EnvironmentListView