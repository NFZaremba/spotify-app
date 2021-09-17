import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { getRefreshToken } from "../../services/spotify";
import {
  getLocalAccessToken,
  hasTokenExpired,
  setAllLocalTokenParams,
} from "../../services/token";
import { localStorageKeys } from "../constants/spotify";
import { Options } from "../types/spotify";
import { useAxios } from "../utils/api";
import catchErrors from "../utils/catchErrors";

const defaultOpt = { time_range: "short_term", limit: 20 };

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
    }),
    { refetchOnWindowFocus: false }
  );
};

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const useGetCurrentUserPlaylists = (limit: number = 20) => {
  const axios = useAxios();

  return useQuery(
    "playlists",
    catchErrors(async () => {
      const { data } = await axios.get(`/me/playlists?limit=${limit}`);

      return data;
    }),
    { refetchOnWindowFocus: false }
  );
};

export const useGetAllUserPlaylists = (limit: number = 20) => {
  const axios = useAxios();

  return useInfiniteQuery(
    ["playlists-infinite"],
    catchErrors(async ({ pageParam }: { pageParam: string }) => {
      const { data } = await axios.get(
        pageParam ? pageParam : `/me/playlists?limit=${limit}`
      );
      return data;
    }),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (nextPage) => {
        if (nextPage.next) return nextPage.next;
        return false;
      },
      // transform the data
      // merge pages
      select: (data) => ({
        pages: data?.pages.flatMap((page) => page.items),
        pageParams: data.pageParams,
      }),
    }
  );
};

/**
 * Get a User's Top Artists and Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const useGetTopArtists = (time_range: string = "short_term") => {
  const axios = useAxios();

  return useQuery(
    ["top-artists", time_range],
    catchErrors(async () => {
      const { data } = await axios.get(
        `/me/top/artists?time_range=${time_range}`
      );

      return data;
    }),
    { refetchOnWindowFocus: false }
  );
};

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const useGetTopTracks = (options: Options = {}) => {
  const axios = useAxios();
  const { time_range = "short_term", limit = 20 } = options;

  return useQuery(
    ["top-tracks", time_range],
    catchErrors(async () => {
      const { data } = await axios.get(
        `/me/top/tracks?time_range=${time_range}`
      );

      return data;
    }),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        if (limit) {
          return { ...data, items: data.items.slice(0, limit) };
        }
        return { ...data };
      },
    }
  );
};
