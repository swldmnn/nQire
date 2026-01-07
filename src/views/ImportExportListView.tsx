import { Box, List } from "@mui/material"
import CustomListItem from "../components/CustomListItem"
import { useTranslation } from "react-i18next"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CategoryTitleBar from "../components/CategoryTitleBar";
import { TabItem } from "../types/types";
import { useTabs } from "../contexts/tabs/useTabs";

function ImportExportListView() {
    const { t } = useTranslation()
    const tabsContext = useTabs()

    const importItem = { id: 1, typename: 'ImportItem', label: t('import_item_label') }
    const exportItem = { id: 2, typename: 'ExportItem', label: t('export_item_label') }

    const openItem = (item: TabItem) => {
        tabsContext.dispatch({ type: 'OPEN_TAB', tabItem: item })
    }

    return (
        <Box>
            <CategoryTitleBar
                title={t('cat_impex')}
                actions={[]}
            />
            <List>
                <CustomListItem
                    key={`ImportListItem`}
                    index={1}
                    item={importItem}
                    onDoubleClick={() => { openItem(importItem) }}
                    icon={ArrowDownwardIcon}
                    actions={[]}
                />
                <CustomListItem
                    key={`ExportListItem`}
                    index={2}
                    item={exportItem}
                    onDoubleClick={() => { openItem(exportItem) }}
                    icon={ArrowUpwardIcon}
                    actions={[]}
                />
            </List>
        </Box>
    )
}

export default ImportExportListView