import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getRefreshToken } from "../../services/spotify";
import {
  getLocalAccessToken,
  hasTokenExpired,
  setAllLocalTokenParams,
} from "../../services/token";
import { localStorageKeys } from "../constants/spotify";
import { useAxios } from "../utils/api";
import catchErrors from "../utils/catchErrors";

export interface ILocalStorageValues {
  [key: string]: string | null;
}

/**
 * auth hook that handles auth params
 * @param queryString
 * @returns
 */
export const useAuth = (queryString: string) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getLocalAccessToken()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>();
  const [expiresIn, setExpiresIn] = useState<string | null>();
  const [hasError, setHasError] = useState<string | null>();

  useEffect(() => {
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      const queryParams = {
        [localStorageKeys.SPOTIFY_ACCESS_TOKEN]: urlParams.get("access_token"),
        [localStorageKeys.SPOTIFY_REFRESH_TOKEN]:
          urlParams.get("refresh_token"),
        [localStorageKeys.SPOTIFY_EXPIRE_TIME]: urlParams.get("expires_in"),
      };
      // const hasError = urlParams.get("error");
      setAccessToken(urlParams.get("access_token"));
      setRefreshToken(urlParams.get("refresh_token"));
      setExpiresIn(urlParams.get("expires_in"));
      setHasError(urlParams.get("error"));

      // If there is a token in the URL query params, user is logging in for the first time
      if (queryParams?.[localStorageKeys.SPOTIFY_ACCESS_TOKEN]) {
        setAllLocalTokenParams(queryParams);
        // Return access token from query params
        setAccessToken(queryParams?.[localStorageKeys.SPOTIFY_ACCESS_TOKEN]);
      }
      window.location.href = "/";
    }

    // If there is a valid access token in localStorage, use that
    if (accessToken) {
      return;
    }

    setAccessToken(null);
  }, []);

  useEffect(() => {
    // If there's an error OR the token in localStorage has expired, refresh the token
    if (hasError || hasTokenExpired()) {
      console.log("getting refresh");
      getRefreshToken();
    }
  }, [refreshToken, expiresIn, hasError]);

  return accessToken;
};

/**
 *  Fetches current user profile
 * @returns data
 */
export const useGetCurrentProfile = () => {
  const axios = useAxios();

  return useQuery(
    "me",
    catchErrors(async () => {
      const { data } = await axios.get("/me");

      // Return the data from the Axios response
      return data;
    })
  );
};
