import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect
} from "react";

import { fetchData } from '@/lib/api';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';

type ConfigItem = {
  [key: string]: string,
};

type ConfigContextType = {
  config: ConfigItem[];
  setConfig: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
};

const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/config`;
const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ConfigItem[]>([]);

  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const data = await fetchData<ConfigItem[] | ErrorResponse>(endpoint, 'GET');
        if (isErrorResponse(data)) {
          console.error('Error fetching shutings data:', data.message);
          return;
        }
        setConfig(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchConfigData();
  }, []);

  useEffect(() => {
    console.log(config);
  }, [config]);

  return (
    <ConfigContext.Provider value={{ 
      config,
      setConfig,
    }}>
      {children}
    </ConfigContext.Provider>
  );
};  

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useAlert must be used within a ConfigProvider");
  }
  return context;
};
