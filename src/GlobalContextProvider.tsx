import AppContextProvider from "./AppContextProvider"
import { EnvironmentProvider } from "./contexts/environment/EnvironmentContext"
import { NotificationProvider } from "./contexts/notification/NotificationContext"
import { TabsProvider } from "./contexts/tabs/TabsContext"

interface GlobalContextProviderProps {
  children: React.ReactNode
}

const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <EnvironmentProvider>
        <TabsProvider>
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </TabsProvider>
      </EnvironmentProvider>
    </NotificationProvider>
  );
};

export default GlobalContextProvider