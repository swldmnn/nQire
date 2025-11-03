import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { HttpRequestResponseProps } from "./types"

interface RequestHeadersProps extends HttpRequestResponseProps {

}

function RequestHeaders({ request, setRequest }: RequestHeadersProps) {
    if (!request) {
        return null
    }

    const onHeaderKeyChange = (index: number, newValue: string) => {
         if (setRequest) {
            const headers = request.headers.map(h => {return {...h}})
            headers[index].key = newValue
            setRequest({...request, headers})
        }
    }

    const onHeaderValueChange = (index: number, newValue: string) => {
        if (setRequest) {
            const headers = request.headers.map(h => {return {...h}})
            headers[index].value = newValue
            setRequest({...request, headers})
        }
    }

    return <Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: 'secondary.main' }}>Key</TableCell>
                        <TableCell sx={{ color: 'secondary.main' }}>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {request.headers.map((header, index) => (
                        <TableRow
                            key={`Request_${request.label}_Header_${header.key}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <TextField
                                    hiddenLabel
                                    variant='outlined'
                                    size='small'
                                    value={header.key}
                                    onChange={(e) => onHeaderKeyChange(index, e.currentTarget.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    hiddenLabel
                                    variant='outlined'
                                    size='small'
                                    value={header.value}
                                    onChange={(e) => onHeaderValueChange(index, e.currentTarget.value)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}

export default RequestHeaders