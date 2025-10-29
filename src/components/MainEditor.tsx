import { useContext } from "react"
import RequestView from "./RequestView"
import TabContainer from "./TabContainer"
import { AppContext } from "../AppContext"

function MainEditor() {
    const appContext = useContext(AppContext)

    return (<TabContainer>
        {
            appContext.appState.openItems.map((item, index) => item.typename === 'HttpRequest'
                ? <RequestView
                    request={item}
                    label={item.label}
                    key={`RequestView_${index}_${item.label}`}
                />
                : null)
        }
    </TabContainer>)
}

export default MainEditor