import { Box, Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ImportItem } from "../types/types";
import { Dispatch, SetStateAction } from "react";
import { styles } from "../constants";

interface ImportModalContentViewProps {
    importItems: ImportItem[]
    setImportItems: Dispatch<SetStateAction<ImportItem[]>>
    onCancel: () => void
    onConfirm: () => void
}


function ImportModalContentView({ importItems, setImportItems, onConfirm, onCancel }: ImportModalContentViewProps) {

    const { t } = useTranslation()

    const toggleSelected = (index: number) => {
        const item = importItems[index];
        item.selected = !item.selected;
        setImportItems([...importItems]);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            maxHeight: '100%',
            flex: 1,
        }} >
            <Typography variant='h6'>
                {t('import_modal_title')}
            </Typography>
            <Box id='scrollable_table' sx={{
                minHeight: 0,
                maxHeight: '100%',
                overflowY: 'auto',
                flex: 1,
                marginTop: styles.spaces.medium,
                marginBottom: styles.spaces.medium,
            }} >
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'secondary.main' }}></TableCell>
                                <TableCell sx={{ color: 'secondary.main' }}>{t('import_cloumn_header_type')}</TableCell>
                                <TableCell sx={{ color: 'secondary.main' }}>{t('import_cloumn_header_name')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {importItems.map((importItem, index) => (
                                <TableRow
                                    key={`import_item_row_${index}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" key={`import_item_${index}_selected`}>
                                        <Checkbox checked={importItem.selected} onClick={() => toggleSelected(index)} />
                                    </TableCell>
                                    <TableCell key={`import_item_${index}_type`}>
                                        <Typography>{importItem.item.typename}</Typography>
                                    </TableCell>
                                    <TableCell key={`import_item_${index}_label`}>
                                        <Typography>{importItem.item.label}</Typography>
                                        {importItem.item.typename === 'HttpRequest' &&
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'text.secondary' }}>
                                                {(importItem.item as any).method} {(importItem.item as any).url}
                                            </Typography>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%'
            }}>
                <Button
                    variant='outlined'
                    onClick={onCancel}
                    sx={{ marginLeft: 'auto' }}
                >
                    {t('cancel')}
                </Button>
                <Button
                    variant='contained'
                    onClick={onConfirm}
                    sx={{ marginLeft: styles.spaces.medium }}
                >
                    {t('import_modal_button_label')}
                </Button>
            </Box>
        </Box>
    );
}

export default ImportModalContentView;