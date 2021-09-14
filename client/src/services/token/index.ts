import { localStorageKeys } from "../../shared/constants/spotify";
import useLocalStorage from "../../shared/hooks/useLocalStorage";

export const getLocalRefreshToken = () => {
  const refreshToken = useLocalStorage.get({
    name: localStorageKeys.SPOTIFY_REFRESH_TOKEN,
  });

  if (refreshToken === "undefined") {
    return null;
  }

  return refreshToken;
};

export const getLocalAccessToken = () => {
  const accessToken = useLocalStorage.get({
    name: localStorageKeys.SPOTIFY_ACCESS_TOKEN,
  });

  if (accessToken === "undefined") {
    return null;
  }

  return accessToken;
};

export const updateLocalAccessToken = (data: string) => {
  useLocalStorage.set({
    name: localStorageKeys.SPOTIFY_ACCESS_TOKEN,
    data: data,
  });
};

export const setLocalTimeStamp = () => {
  useLocalStorage.set({
    name: localStorageKeys.SPOTIFY_TIMESTAMP,
    data: Date.now().toString(),
  });
};

export const getLocalTimestamp = () => {
  const timestamp = useLocalStorage.get({
    name: localStorageKeys.SPOTIFY_TIMESTAMP,
  });

  if (timestamp === "undefined") {
    return null;
  }

  return timestamp;
};

export const getLocalTokenExpireTime = () => {
  const expire = useLocalStorage.get({
    name: localStorageKeys.SPOTIFY_EXPIRE_TIME,
  });

  if (expire === "undefined") {
    return null;
  }

  return expire;
};

export interface ILocalStorageValues {
  [key: string]: string | null;
}

export const setAllLocalTokenParams = (queryParams: ILocalStorageValues) => {
  // Store the query params in localStorage
  Object.keys(queryParams).forEach((property) =>
    useLocalStorage.set({
      name: property,
      data: queryParams[property] as string,
    })
  );
  // Set timestamp
  setLocalTimeStamp();
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
export const hasTokenExpired = () => {
  const accessToken = getLocalAccessToken();
  const timestamp = getLocalTimestamp();
  const expireTime = getLocalTokenExpireTime();

  if (!accessToken || !timestamp) {
    return false;
  }

  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};
