export interface ILocalStorageKeys {
  SPOTIFY_ACCESS_TOKEN: string;
  SPOTIFY_REFRESH_TOKEN: string;
  SPOTIFY_EXPIRE_TIME: string;
  SPOTIFY_TIMESTAMP: string;
}

export const localStorageKeys: ILocalStorageKeys = {
  SPOTIFY_ACCESS_TOKEN: "spotify_access_token",
  SPOTIFY_REFRESH_TOKEN: "spotify_refresh_token",
  SPOTIFY_EXPIRE_TIME: "spotify_token_expire_time",
  SPOTIFY_TIMESTAMP: "spotify_token_timestamp",
};
