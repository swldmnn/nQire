import { Box, Button, Checkbox, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ImportItem } from "../types/types";
import { Dispatch, SetStateAction } from "react";
import { NO_IMPORT_TARGET_ID, queries, styles } from "../constants";
import { fetchRequestSets } from "../api/requests";
import { useQuery } from "@tanstack/react-query";

interface ImportModalContentViewProps {
    importItems: ImportItem[]
    setImportItems: Dispatch<SetStateAction<ImportItem[]>>
    onCancel: () => void
    onConfirm: () => void
}


function ImportModalContentView({ importItems, setImportItems, onConfirm, onCancel }: ImportModalContentViewProps) {
    const { t } = useTranslation()

    const { data: requestSets } = useQuery({
        queryKey: [queries.fetchRequestSets],
        queryFn: fetchRequestSets
    })

    const toggleSelected = (index: number) => {
        const item = importItems[index];
        item.selected = !item.selected;
        setImportItems([...importItems]);
    }

    const onChangeName = (index: number, newName: string) => {
        const item = importItems[index];
        item.item.label = newName;
        setImportItems([...importItems]);
    }

    const onChangeTarget = (index: number, newTargetId: number) => {
        const item = importItems[index];
        item.targetId = newTargetId === NO_IMPORT_TARGET_ID ? undefined : newTargetId;
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
                                <TableCell sx={{ color: 'secondary.main' }}>{t('import_cloumn_header_target')}</TableCell>
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
                                        {importItem.item.typename === 'HttpRequest' &&
                                            <Typography
                                                noWrap
                                                variant="body2"
                                                sx={{ color: 'text.secondary', maxWidth: styles.dimensions.import_modal_column_width_type }}>
                                                {(importItem.item as any).method} {(importItem.item as any).url}
                                            </Typography>}
                                    </TableCell>
                                    <TableCell key={`import_item_${index}_label`}>
                                        <TextField
                                            value={importItem.item.label}
                                            onChange={(e) => { onChangeName(index, e.currentTarget.value) }}
                                            variant='outlined'
                                            size='small'
                                            sx={{ width: '100%' }}
                                        />
                                    </TableCell>
                                    <TableCell key={`import_item_${index}_target`}>
                                        {importItem.item.typename === 'HttpRequest' && (
                                            <Select
                                                key={`import_item_${index}_target_select`}
                                                size="small"
                                                value={importItem.targetId ?? NO_IMPORT_TARGET_ID}
                                                sx={{ width: styles.dimensions.import_modal_column_width_target }}
                                                onChange={e => {onChangeTarget(index, e.target.value as number)}}
                                            >
                                                <MenuItem value={NO_IMPORT_TARGET_ID}>
                                                    {t('import_target_new_request_set')}
                                                </MenuItem>
                                                {requestSets?.map((requestSet) => (
                                                    <MenuItem
                                                        key={`import_item_${index}_target_option_${requestSet.id}`}
                                                        value={requestSet.id}
                                                    >
                                                        {requestSet.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}

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