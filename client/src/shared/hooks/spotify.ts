import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { getRefreshToken } from "../../services/spotify.service";
import {
  getLocalAccessToken,
  hasTokenExpired,
  setAllLocalTokenParams,
} from "../../services/token.service";
import { localStorageKeys } from "../constants/spotify";
import { Options } from "../types/spotify";
import { useAxios } from "../utils/api";
import catchErrors from "../utils/catchErrors";

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
export const useGetCurrentUserPlaylists = (options: Options = {}) => {
  const axios = useAxios();
  const { limit = 20 } = options;

  return useQuery(
    "playlists",
    catchErrors(async () => {
      const { data } = await axios.get(`/me/playlists?limit=${limit}`);

      return data;
    }),
    { refetchOnWindowFocus: false }
  );
};

/**
 * Get all of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
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
export const useGetTopArtists = (options: Options = {}) => {
  const axios = useAxios();
  const { time_range = "short_term", limit = 20 } = options;

  return useQuery(
    ["top-artists", time_range],
    catchErrors(async () => {
      const { data } = await axios.get(
        `/me/top/artists?time_range=${time_range}`
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

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-playlist
 * @param {string} playlist_id - The Spotify ID for the playlist.
 * @returns {Promise}
 */
export const useGetPlaylistById = (playlistId: string) => {
  const axios = useAxios();

  return useInfiniteQuery(
    ["playlist"],
    catchErrors(async ({ pageParam }: { pageParam: string }) => {
      const { data } = await axios.get(
        pageParam ? pageParam : `/playlists/${playlistId}`
      );

      return data;
    }),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (nextPage) => {
        // if (nextPage) console.log("nextpage", nextPage);
        if (nextPage?.tracks?.next) return nextPage?.tracks?.next;
        if (nextPage?.next) return nextPage?.next;
        return false;
      },
      // transform the data
      // merge pages
      select: (data) => ({
        ...data,
        pages: [
          {
            trackIdList: data?.pages.map((page) => {
              const items = page.items ? page.items : page.tracks.items;
              return items
                .map(({ track }: { track: { id: string } }) => track.id)
                .join(",");
            }),
            initialData: { ...data.pages[0] },
            allTracks: data?.pages
              .flatMap((page) => {
                if (page.items) {
                  return page.items;
                }
                return page.tracks.items;
              })
              .map(({ track }) => track),
          },
        ],
        pageParams: data.pageParams,
      }),
    }
  );
};

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-several-audio-features
 * @param {string} ids - A comma-separated list of the Spotify IDs for the tracks
 * @returns {Promise}
 */
export const useGetAudioFeaturesForTracks = (trackids: string[]) => {
  const axios = useAxios();

  return useInfiniteQuery(
    ["audio-feature"],
    catchErrors(async ({ pageParam = 0 }: { pageParam: number }) => {
      const { data } = await axios.get(
        "/audio-features?ids=" + trackids[pageParam]
      );
      return data;
    }),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        if (pages.length === trackids.length) return false;
        return pages.length;
      },
      enabled: Boolean(trackids.length),
    }
  );
};
