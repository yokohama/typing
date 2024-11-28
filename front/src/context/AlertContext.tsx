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
  alert: AlertType | null;
  setAlert: React.Dispatch<React.SetStateAction<AlertType | null>>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertType | null>(null);

  return (
    <AlertContext.Provider value={{ 
      alert,
      setAlert,
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
