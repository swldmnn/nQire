import { EnvironmentProvider } from "./contexts/environment/EnvironmentContext"
import { ItemsProvider } from "./contexts/items/ItemsContext"
import { NotificationProvider } from "./contexts/notification/NotificationContext"
import { TabsProvider } from "./contexts/tabs/TabsContext"

interface AppContextProviderProps {
  children: React.ReactNode
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <EnvironmentProvider>
        <TabsProvider>
          <ItemsProvider>
            {children}
          </ItemsProvider>
        </TabsProvider>
      </EnvironmentProvider>
    </NotificationProvider>
  );
};

export default AppContextProvider