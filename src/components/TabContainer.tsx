import { Box, Tab, Tabs } from "@mui/material"
import React, { useState } from "react";

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

function CustomTabPanel(props: TabPanelProps) {
    const { children, isSelected, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={!isSelected}
            {...other}
        >
            {isSelected && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function TabContainer({ children, onClose }: TabContainerProps) {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTabIndex(newValue);
    };

    const tabItems = React.Children.toArray(children)
        .filter(child => React.isValidElement(child) && isTabContentProps(child.props))

    if (selectedTabIndex > 0 && selectedTabIndex >= tabItems.length) {
        setSelectedTabIndex(Math.max(0, tabItems.length - 1))
    }

    return (children &&
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    scrollButtons="auto"
                    variant="scrollable"
                    value={selectedTabIndex}
                    onChange={handleChange}
                >
                    {
                        tabItems.map((child, index) => {
                            return (React.isValidElement(child) && isTabContentProps(child.props))
                                ? <Tab
                                    label={<div>{child.props.label}<span onClick={() => onClose?.(index)}> [x]</span></div>}
                                    key={`tab_${index}_${child.props.label}`}
                                ></Tab>
                                : null
                        })
                    }
                </Tabs>
            </Box>
            {
                tabItems.map((child, index) => {
                    return (React.isValidElement(child) && isTabContentProps(child.props))
                        ? <CustomTabPanel
                            index={index}
                            isSelected={index === selectedTabIndex}
                            key={`tabPanel_${index}_${child.props.label}`}>
                            {child}
                        </CustomTabPanel>
                        : null
                })
            }
        </Box>
    )
}

export default TabContainer