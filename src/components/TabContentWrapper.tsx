interface TabContentWrapperProps {
    label?: string;
    children?: React.ReactNode;
}

function TabContentWrapper(props: TabContentWrapperProps) {
    return (props.children)
}

export default TabContentWrapper