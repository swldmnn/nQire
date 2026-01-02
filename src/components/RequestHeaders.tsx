import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { HttpRequestResponseProps } from "../types/types"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useTranslation } from "react-i18next";

interface RequestHeadersProps extends HttpRequestResponseProps {
}

function RequestHeaders({ request, setRequest }: RequestHeadersProps) {
    if (!request || !setRequest) {
        return null
    }

    const {t} = useTranslation()

    const onHeaderKeyChange = (index: number, newValue: string) => {
        const headers = request.headers.map(h => { return { ...h } })
        headers[index].key = newValue
        setRequest({ ...request, headers })
    }

    const onHeaderValueChange = (index: number, newValue: string) => {
        const headers = request.headers.map(h => { return { ...h } })
        headers[index].value = newValue
        setRequest({ ...request, headers })
    }

    const onHeaderDelete = (index: number) => {
        const headers = request.headers.map(h => { return { ...h } })
        headers.splice(index, 1)
        setRequest({ ...request, headers })
    }

    const onHeaderAdd = () => {
        const headers = request.headers.map(h => { return { ...h } })
        headers.push({ key: '', value: '' })
        setRequest({ ...request, headers })
    }

    return <Box>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: 'secondary.main' }}>{t('request_header_key')}</TableCell>
                        <TableCell sx={{ color: 'secondary.main' }}>{t('request_header_value')}</TableCell>
                        <TableCell sx={{ color: 'secondary.main' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {request.headers.map((header, index) => (
                        <TableRow
                            key={`request_${request.label}_header_${index}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" key={`header_key_${index}`}>
                                <TextField
                                    hiddenLabel
                                    variant='outlined'
                                    size='small'
                                    key={`header_key_${index}`}
                                    value={header.key}
                                    onChange={(e) => onHeaderKeyChange(index, e.currentTarget.value)}
                                />
                            </TableCell>
                            <TableCell key={`header_value_${index}`}>
                                <TextField
                                    hiddenLabel
                                    variant='outlined'
                                    size='small'
                                    key={`header_value_${index}`}
                                    value={header.value}
                                    onChange={(e) => onHeaderValueChange(index, e.currentTarget.value)}
                                />
                            </TableCell>
                            <TableCell key={`header_delete_${index}`}>
                                <IconButton
                                    sx={{ color: 'secondary.main' }}
                                    size='small'
                                    key={`header_delete_button_${index}`}
                                    onClick={() => onHeaderDelete(index)}
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow key={`request_${request.label}_header_add`}>
                        <TableCell colSpan={3} key='header_add'>
                            <IconButton sx={{ color: 'secondary.main' }} onClick={() => onHeaderAdd()}>
                                <AddSharpIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}

export default RequestHeaders