import { AxiosInstance } from "axios";
import React, { useContext, createContext, useMemo } from "react";
import axios from "axios";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  setLocalTimeStamp,
  updateLocalAccessToken,
} from "../../services/token";

const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

export const useAxios = () => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error(
      `Axios context cannot be rendered outside the the provider.`
    );
  }
  return context;
};

export const AxiosProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const value = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: {
        "Content-Type": "application/json",
        Authorization: getLocalAccessToken()
          ? `Bearer ${getLocalAccessToken()}`
          : undefined,
      },
    });

    instance.interceptors.request.use(
      (config) => {
        // Read token for anywhere, in this case directly from localStorage
        const token = getLocalAccessToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/auth/signin" && err.response) {
          // Access Token was expired
          if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;

            try {
              console.log("Refreshing Token");
              const { data } = await axios.get(
                `/refresh_token?refresh_token=${getLocalRefreshToken()}`
              );
              console.log("Refreshing Token - Completed");
              // Update localStorage values
              updateLocalAccessToken(data.access_token);
              setLocalTimeStamp();

              return instance(originalConfig);
            } catch (_error) {
              return Promise.reject(_error);
            }
          }
        }

        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  return (
    <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
  );
};

export default AxiosProvider;
