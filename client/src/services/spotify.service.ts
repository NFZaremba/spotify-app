import axios from "axios";
import { localStorageKeys } from "../shared/constants/spotify";
import useLocalStorage from "../shared/hooks/useLocalStorage";
import { setLocalTimeStamp, updateLocalAccessToken } from "./token.service";

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
export const getRefreshToken = async () => {
  const refreshToken = useLocalStorage.get({
    name: localStorageKeys.SPOTIFY_REFRESH_TOKEN,
  });
  const timestamp = useLocalStorage.get({
    name: localStorageKeys.SPOTIFY_TIMESTAMP,
  });

  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !refreshToken ||
      refreshToken === "undefined" ||
      Date.now() - Number(timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
      return;
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${refreshToken}`
    );

    // Update localStorage values
    updateLocalAccessToken(data.access_token);
    setLocalTimeStamp();

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  Object.entries(localStorageKeys).forEach(([_property, value]) =>
    useLocalStorage.remove({
      name: value,
    })
  );

  window.location.href = window.location.origin;
};
