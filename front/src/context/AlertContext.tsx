import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode 
} from "react";

export type AlertType = {
  type: "success" | "error";
  msg: string;
};

type AlertContextType = {
  alerts: AlertType[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertType[]>>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  return (
    <AlertContext.Provider value={{ 
      alerts,
      setAlerts,
    }}>
      {children}
    </AlertContext.Provider>
  );
};  

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};
