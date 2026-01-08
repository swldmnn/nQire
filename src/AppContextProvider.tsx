import { EnvironmentProvider } from "./contexts/environment/EnvironmentContext"
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
          {children}
        </TabsProvider>
      </EnvironmentProvider>
    </NotificationProvider>
  );
};

export default AppContextProvider