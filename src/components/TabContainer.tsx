import { Box, Tab, Tabs } from "@mui/material"
import React, { useContext, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { AppContext } from "../AppContext";

interface TabContainerProps {
    onClose?: (index: number) => void
    children?: React.ReactNode;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    isSelected: boolean;
}

export interface TabContentProps {
    label: string
}

const isTabContentProps = (object: any): object is TabContentProps => !!object.label

function CustomTabPanel({ children, isSelected, index, ...other }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={!isSelected}
            {...other}
            sx={{
                width: '100%',
                height: '100%',
                minWidth: 0,
                minHeight: 0,
                boxSizing: 'border-box',
            }}
        >
            {children}
        </Box>
    );
}

function TabContainer({ children, onClose }: TabContainerProps) {

    const appContext = useContext(AppContext)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        appContext.updateAppState({
            ...appContext.appState,
            selectedTabIndex: newValue
        })
    };

    const tabItems = React.Children.toArray(children)
        .filter(child => React.isValidElement(child) && isTabContentProps(child.props))

    const effectiveSelectedIndex = appContext.appState.selectedTabIndex > 0 && appContext.appState.selectedTabIndex >= tabItems.length
        ? Math.max(0, tabItems.length - 1) : appContext.appState.selectedTabIndex

    useEffect(() => {
        if (appContext.appState.selectedTabIndex !== effectiveSelectedIndex) {
            appContext.updateAppState({ ...appContext.appState, selectedTabIndex: effectiveSelectedIndex })
        }
    })

    return (children &&
        <Box sx={{
            width: '100%',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    scrollButtons="auto"
                    variant="scrollable"
                    value={effectiveSelectedIndex}
                    onChange={handleChange}
                >
                    {tabItems.map((child, index) => {
                        return (React.isValidElement(child) && isTabContentProps(child.props))
                            ? <Tab
                                label={<div>
                                    {child.props.label}
                                    <CloseIcon
                                        onClick={(e) => { e.stopPropagation(); onClose?.(index) }}
                                        sx={{ height: '1rem', verticalAlign: 'bottom', color: 'secondary.main' }}
                                    />
                                </div>}
                                key={`tab_${index}_${child.props.label}`}
                            ></Tab>
                            : null
                    })}
                </Tabs>
            </Box>
            <Box sx={{
                flexGrow: 1,
                minWidth: 0,
                minHeight: 0,
            }}>
                {tabItems.map((child, index) => {
                    return (React.isValidElement(child) && isTabContentProps(child.props))
                        ? <CustomTabPanel
                            index={index}
                            isSelected={index === effectiveSelectedIndex}
                            key={`tabPanel_${index}_${child.props.label}`}>
                            {child}
                        </CustomTabPanel>
                        : null
                })}
            </Box>
        </Box>
    )
}

export default TabContainer