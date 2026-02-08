
export const styles = {
    spaces: {
        xLarge: '1.5rem',
        large: '.8rem',
        medium: '.5rem',
        small: '.1rem',
        modal_padding: 4,
    },
    dimensions: {
        max_tab_width: '8rem',
        navigation_panel_width: '14rem',
        navigation_sidebar_width: '6rem',
        rename_item_modal_width: '25rem',
        import_box_max_width: '100%',
        import_modal_width: '80vw',
        import_modal_height: '80vh',
        import_modal_column_width_type: '15rem',
        import_modal_column_width_target: '15rem',
    }
}

export const queries = {
    fetchEnvironments: 'fetchEnvironments',
    fetchEnvironment: 'fetchEnvironment',
    fetchRequestSets: 'fetchRequestSets',
    fetchRequest: 'fetchRequest',
}

export const REPAINT_TIMEOUT = 30
export const EMTPY_RESPONSE_STATUS = 0
export const NO_ENVIRONMENT_ID = -1
export const NO_TAB_INDEX = -1
export const NO_IMPORT_TARGET_ID = -1