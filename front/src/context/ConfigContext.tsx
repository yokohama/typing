import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect
} from "react";

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
    /*
     * The retrieval of settings dose not require `JWT` authentication, 
     * so `fetchData()` in `lib/api.ts` is not used.
     */
    const fetchConfigData = async () => {
      try {
        let res = await fetch(endpoint, { method: 'GET' });
        if (!res.ok) {
          console.error('API Error: ', res);
          return null;
        }

        let jsonBody: ConfigItem[] = await res.json();
        if (!jsonBody || Object.keys(jsonBody).length === 0) {
          console.error('API Error: ', res);
          return null;
        }

        setConfig(jsonBody);
      } catch (error) {
        console.error('API Error: ', error);
      }
    };

    fetchConfigData();
  }, []);

  useEffect(() => {
    if (config.length > 0) {
      console.log('## welcome typing app.');
      console.log(config);
    }
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
