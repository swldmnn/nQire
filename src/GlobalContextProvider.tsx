import AppContextProvider from "./AppContextProvider";
import { EnvironmentProvider } from "./contexts/environment/EnvironmentContext";
import { NotificationProvider } from "./contexts/notification/NotificationContext";

interface GlobalContextProviderProps {
  children: React.ReactNode
}

const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <EnvironmentProvider>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </EnvironmentProvider>
    </NotificationProvider>
  );
};

export default GlobalContextProvider;