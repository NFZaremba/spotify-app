import { AxiosError, AxiosResponse } from "axios";
import { Request, Response } from "express";

require("dotenv").config();
const express = require("express");
const querystring = require("querystring");
const app = express();
const axios = require("axios");
const PORT = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length: number) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/", (_req: Request, res: Response) => {
  const data = {
    name: "Nickzssss",
    isAwesome: true,
  };

  res.json(data);
});

const stateKey = "spotify_auth_state";

app.get("/login", (_req: Request, res: Response) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = "user-read-private user-read-email";

  const queryParams = querystring.stringify({
    state,
    scope,
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req: Request, res: Response) => {
  const code = req.query.code || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        // if (response.status === 200) {
        //   console
        //   res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        // } else {
        //   res.send(response);
        // }
        // return;
        // const { access_token, token_type } = response.data;

        // axios
        //   .get("https://api.spotify.com/v1/me", {
        //     headers: {
        //       Authorization: `${token_type} ${access_token}`,
        //     },
        //   })
        //   .then((response: AxiosResponse) => {
        //     res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        //   })
        //   .catch((error: AxiosError) => {
        //     res.send(error);
        //   });

        const { refresh_token } = response.data;

        axios
          .get(
            `http://localhost:8888/refresh_token?refresh_token=${refresh_token}`
          )
          .then((response: AxiosResponse) => {
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
          })
          .catch((error: AxiosError) => {
            res.send(error);
          });
      } else {
        res.send(response);
      }
    })
    .catch((error: AxiosError) => {
      res.send(error);
    });
});

app.get("/refresh_token", (req: Request, res: Response) => {
  const { refresh_token } = req.query;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response: AxiosResponse) => {
      res.send({ ...response.data, hi: "helo" });
    })
    .catch((error: AxiosError) => {
      res.send(error);
    });
});

app.listen(PORT, () => {
  console.log(`Express app listening at http:localhost:${PORT}`);
});
