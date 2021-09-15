import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { URLSearchParams } from "url";
import { catchErrors } from "../utils/asyncCatch";
import { ServerError } from "../utils/customErrors";
import { generateRandomString } from "../utils/generateRandomString";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/**
 * Login
 *
 * @param _req
 * @param res
 */
export const spotifyLogin = (_req: Request, res: Response) => {
  const state = generateRandomString(16);
  const stateKey = "spotify_auth_state";

  // set cookie
  res.cookie(stateKey, state);

  // scope
  const scope = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "playlist-read-private",
  ].join(" ");

  const queryParams = new URLSearchParams({
    state,
    scope,
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
  }).toString();

  // redirect to spotify's oath
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
};

export interface ISpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
}

/**
 * Callback
 *
 * @param _req
 * @param res
 */
export const spotifyCallback = catchErrors(
  async (req: Request, res: Response) => {
    const { code } = req.query;

    if (typeof code !== "string") {
      throw new ServerError("Query param 'code' has to be of type string", 400);
    }

    const payload = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }).toString();

    // get access token
    const response: AxiosResponse<ISpotifyToken> = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: payload,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });
    console.log("status", JSON.stringify(response.status));
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const queryParams = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in,
      }).toString();

      // redirect to react app
      res.redirect(`http://localhost:3000/?${queryParams}`);

      // pass tokens and query params
    } else {
      res.redirect(
        `/?${new URLSearchParams({ error: "invalid_token" }).toString()}`
      );
    }
  }
);

/**
 * Refresh Token
 *
 * @param _req
 * @param res
 */
export const spotifyRefresh = catchErrors(
  async (req: Request, res: Response) => {
    const { refresh_token } = req.query;

    if (typeof refresh_token !== "string") {
      throw new ServerError(
        "Query param 'refresh_token' has to be of type string",
        400
      );
    }

    const payload = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }).toString();

    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: payload,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    res.send(response.data);
  }
);
