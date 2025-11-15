import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { Environment } from "./types"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddSharpIcon from '@mui/icons-material/AddSharp';

interface EnvironmentViewProps {
    environment: Environment
}

function EnvironmentView({ environment }: EnvironmentViewProps) {
    if (!environment) {
        return null
    }

    const onKeyChange = (index: number, newValue: string) => {
        // TODO
    }

    const onValueChange = (index: number, newValue: string) => {
        // TODO
    }

    const onValueDelete = (index: number) => {
        // TODO
    }

    const onValueAdd = () => {
        // TODO
    }

    return <Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: 'secondary.main' }}>Key</TableCell>
                        <TableCell sx={{ color: 'secondary.main' }}>Value</TableCell>
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