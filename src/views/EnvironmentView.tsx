import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { Environment } from "../types/types"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useContext, useState } from "react";
import ItemTitleBar from "../components/ItemTitleBar";
import { AppContext } from "../AppContext";
import { useTranslation } from "react-i18next";
import { showResultNotification } from "../helpers/notificationHelper";

interface EnvironmentViewProps {
    environment: Environment
}

function EnvironmentView({ environment: inputEnvironment }: EnvironmentViewProps) {

    const appContext = useContext(AppContext)
    const { t } = useTranslation()

    const [environment, setEnvironment] = useState({ ...inputEnvironment })
    const [isModified, setIsModified] = useState(false)

    const modifyEnvironment = (environment: Environment) => {
        setEnvironment(environment)
        setIsModified(true)
    }

    if (!environment) {
        return null
    }

    const onLabelChange = (newValue: string) => {
        modifyEnvironment({ ...environment, label: newValue })
    }

    const onKeyChange = (index: number, newValue: string) => {
        const values = environment.values.map(h => { return { ...h } })
        values[index].key = newValue
        modifyEnvironment({ ...environment, values })
    }

    const onValueChange = (index: number, newValue: string) => {
        const values = environment.values.map(h => { return { ...h } })
        values[index].value = newValue
        modifyEnvironment({ ...environment, values })
    }

    const onValueDelete = (index: number) => {
        const values = environment.values.map(h => { return { ...h } })
        values.splice(index, 1)
        modifyEnvironment({ ...environment, values })
    }

    const onValueAdd = () => {
        const values = environment.values.map(h => { return { ...h } })
        values.push({ key: '', value: '' })
        modifyEnvironment({ ...environment, values })
    }

    const onSave = async () => {
        appContext.saveItem(environment)
            .then(result => {
                if (result === true) {
                    setIsModified(false)
                }
                showResultNotification(appContext, result, t('item_saved'))
            })
            .catch(error => showResultNotification(appContext, error, t('error_save_environment')))
    }

    return <Box>
        <ItemTitleBar item={environment} isModified={isModified} onItemSave={onSave} onLabelChange={onLabelChange} />
        <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
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
                    <TableRow key={`environment_${environment.label}_value_add`}>
                        <TableCell colSpan={3} key='value_add'>
                            <IconButton sx={{ color: 'secondary.main' }} onClick={() => onValueAdd()}>
                                <AddSharpIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}

export default EnvironmentView