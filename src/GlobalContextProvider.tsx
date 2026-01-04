import AppContextProvider from "./AppContextProvider";
import { NotificationProvider } from "./contexts/notification/NotificationContext";

interface GlobalContextProviderProps {
  children: React.ReactNode
}

const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </NotificationProvider>
  );
};

export default GlobalContextProvider;