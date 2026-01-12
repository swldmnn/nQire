import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { Environment } from "../types/types"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddSharpIcon from '@mui/icons-material/AddSharp'
import { useEffect, useState } from "react"
import ItemTitleBar from "../components/ItemTitleBar"
import { useTranslation } from "react-i18next"
import { useNotification } from "../contexts/notification/useNotification"
import { useTabs } from "../contexts/tabs/useTabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchEnvironment, saveEnvironment } from "../api/environments"
import { EnvironmentTransfer } from "../types/types_transfer"
import { queries, styles } from "../constants"

interface EnvironmentViewProps {
    environmentId: number
}

function EnvironmentView({ environmentId }: EnvironmentViewProps) {
    const { t } = useTranslation()
    const notificationContext = useNotification()
    const tabsContext = useTabs()
    const queryClient = useQueryClient()

    const { data: fetchedEnvironment } = useQuery({
        queryKey: ['fetchEnvironment', environmentId],
        queryFn: () => fetchEnvironment(environmentId),
        staleTime: Infinity,
        refetchOnMount: 'always',
    })

    const [isModified, setIsModified] = useState(false)
    const [environment, setEnvironment] = useState(fetchedEnvironment)

    useEffect(() => {
        if (fetchedEnvironment) {
            setEnvironment(fetchedEnvironment)
        }
    }, [fetchedEnvironment])

    const saveEnvironmentMutation = useMutation({
        mutationFn: saveEnvironment,
        onSuccess: () => {
            if (environment) {
                setIsModified(false)
                queryClient.invalidateQueries({ queryKey: [queries.fetchEnvironments] })
                queryClient.invalidateQueries({ queryKey: [queries.fetchEnvironment, environmentId] })
                tabsContext.dispatch({ type: 'UPDATE_TAB', tabItem: environment })
                notificationContext.dispatch({ type: 'NOTIFY', payload: { value: {}, defaultMessage: t('item_saved') } })
            }
        },
        onError: (error) => {
            notificationContext.dispatch({ type: 'NOTIFY', payload: { value: error, defaultMessage: t('error_save_environment') } })
        }
    })

    const modifyEnvironment = (updatedEnvironment: Environment) => {
        setEnvironment(prev => {
            if (!prev) {
                return prev
            }

            return { ...prev, ...updatedEnvironment }
        })

        setIsModified(true)
    }

    const syncEnvironmentToQueryCache = () => {
        if (environment) {
            queryClient.setQueryData([queries.fetchEnvironment, environmentId], environment)
        }
    }

    const onLabelChange = (newValue: string) => {
        if (environment) {
            modifyEnvironment({ ...environment, label: newValue })
        }
    }

    const onKeyChange = (index: number, newValue: string) => {
        if (environment) {
            const values = environment.values.map(value => { return { ...value } })
            values[index].key = newValue
            modifyEnvironment({ ...environment, values })
        }
    }

    const onValueChange = (index: number, newValue: string) => {
        if (environment) {
            const values = environment.values.map(value => { return { ...value } })
            values[index].value = newValue
            modifyEnvironment({ ...environment, values })
        }
    }

    const onValueDelete = (index: number) => {
        if (environment) {
            const values = environment.values.map(value => { return { ...value } })
            values.splice(index, 1)
            modifyEnvironment({ ...environment, values })
        }
    }

    const onValueAdd = () => {
        if (environment) {
            const values = environment.values.map(value => { return { ...value } })
            values.push({ key: '', value: '' })
            modifyEnvironment({ ...environment, values })
            syncEnvironmentToQueryCache()
        }
    }

    const onSave = async () => {
        if (environment) {
            saveEnvironmentMutation.mutate(environment as EnvironmentTransfer)
        }
    }

    return <Box sx={{
        height: '100%',
        width: '100%',
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: styles.spaces.medium,
        boxSizing: 'border-box',
    }}>
        {environment && <Box>
            <ItemTitleBar item={environment} isModified={isModified} onItemSave={onSave} onLabelChange={onLabelChange} />
            <TableContainer>
                <Table sx={{ minWidth: 500 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'secondary.main' }}>{t('environment_key')}</TableCell>
                            <TableCell sx={{ color: 'secondary.main' }}>{t('environment_value')}</TableCell>
                            <TableCell sx={{ color: 'secondary.main' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {environment.values.map((value, index) => (
                            <TableRow
                                key={`environment_${environment.label}_value_${index}`}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" key={`environment_key_${index}`}>
                                    <TextField
                                        hiddenLabel
                                        variant='outlined'
                                        size='small'
                                        key={`value_key_${index}`}
                                        value={value.key}
                                        onChange={(e) => onKeyChange(index, e.currentTarget.value)}
                                        onBlur={syncEnvironmentToQueryCache}
                                        sx={{ width: '100%' }}
                                        slotProps={{
                                            htmlInput: {
                                                autoCorrect: 'off',
                                                autoCapitalize: 'off',
                                                spellCheck: false,
                                                inputMode: 'text',
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell key={`environment_value_${index}`}>
                                    <TextField
                                        hiddenLabel
                                        variant='outlined'
                                        size='small'
                                        key={`value_value_${index}`}
                                        value={value.value}
                                        onChange={(e) => onValueChange(index, e.currentTarget.value)}
                                        onBlur={syncEnvironmentToQueryCache}
                                        sx={{ width: '100%' }}
                                        slotProps={{
                                            htmlInput: {
                                                autoCorrect: 'off',
                                                autoCapitalize: 'off',
                                                spellCheck: false,
                                                inputMode: 'text',
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell key={`environment_value_delete_${index}`}>
                                    <IconButton
                                        sx={{ color: 'secondary.main' }}
                                        size='small'
                                        key={`environment_value_delete_button_${index}`}
                                        onClick={() => onValueDelete(index)}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow key={`environment_${environment.label}_value_add`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell colSpan={3} key='value_add'>
                                <IconButton sx={{ color: 'secondary.main' }} onClick={() => onValueAdd()}>
                                    <AddSharpIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>}
    </Box>
}

export default EnvironmentView